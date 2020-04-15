// pages/user/reportevents/reportevents.js

const api = require('../../../api/api.js')
const util = require('../../../utils/util.js')

Page({

  data: {
    form: {},
    tabIndex: 0,
    isEnd: false,
    isEmpty: false,
    datalist: []
  },

  onLoad(options) {

  },

  onShow() {
    this.reloadList()
  },

  loadList() {
    wx.showNavigationBarLoading()
    api.getReportEvents(this.data.form).then(res => {
      if (res.list.length) {
        res.list.map(n => {
          let date = util.splitTime(new Date(n.event_time))
          n.event_time = [date.year, date.month, date.day].join('.')
          n.event_date = [date.year, '年', date.month, '月', date.day, '日', date.hour > 12 ? '下午' : '上午', date.hour, '时', date.minute, '分'].join('')
          return n
        })
        this.setData({
          isEnd: false,
          isEmpty: false,
          datalist: this.data.datalist.concat(res.list)
        }, () => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        })
        this.data.form.lastpage = res.lastpage
      } else {
        this.setData({
          isEnd: this.data.datalist.length > 0,
          isEmpty: this.data.datalist.length === 0,
          datalist: this.data.datalist
        }, () => {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        })
      }
    }).catch(err => {
      wx.hideNavigationBarLoading()
    })
  },

  reloadList() {
    this.data.form.lastpage = ''
    this.data.datalist = []
    this.loadList()
  },

  onPullDownRefresh() {
    this.reloadList()
  },

  onReachBottom() {
    this.loadList()
  },

  onClickTab(e) {
    this.data.form.status = e.detail.current
    this.setData({
      tabIndex: e.detail.current
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.reloadList()
  },

  openDocument(e) {
    // 查看文书
    let id = ~~e.currentTarget.dataset.id
    if (this.data.docfile) {
      return this.opendocfile()
    }
    wx.showLoading({
      title: '下载中...',
      mask: true
    })
    api.paynote({ report_id: id }).then(res => {
      wx.downloadFile({
        url: res.doc_url,
        success: (res) => {
          this.data.docfile = res.tempFilePath
          this.opendocfile()
        },
        fail(err) {
          wx.showToast({
            icon: 'none',
            title: '下载失败，请重试。',
          })
        },
        complete(res) {
          wx.hideLoading()
        }
      })
    }).catch(err => {})
  },

  opendocfile() {
    wx.openDocument({
      showMenu: false,
      filePath: this.data.docfile,
      fileType: 'docx',
      success(res) {
        
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '文档打开失败，请重试。',
        })
      }
    })
  },

  handleStep1(e) {
    // 自主处理 1
    let id = ~~e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '请你在申请自主处理前，在“查看文书”栏中对道路赔补偿通知书内容及结果进行确认，是否同意结果？',
      confirmText: '同意',
      confirmColor: 'green',
      cancelText: '不同意',
      cancelColor: 'red',
      success: (res) => {
        if (res.confirm) {
          this.handleStep2(id)
        }
      }
    })
  },

  handleStep2(id) {
    // 自主处理 2
    wx.showModal({
      title: '',
      content: '该车造成的高速公路路产受损，你是否有权处理此事？如有，是否愿意承担相应的赔偿费？',
      confirmText: '有权承担',
      confirmColor: 'green',
      cancelText: '无权处理',
      cancelColor: 'red',
      success: (res) => {
        if (res.confirm) {
          this.handleStep3(id)
        }
      }
    })
  },

  handleStep3(id) {
    // 自主处理 3
    wx.showModal({
      title: '',
      content: '你还有其他需要陈述、申辩或者其他有异议的事项吗？',
      confirmText: '没有',
      confirmColor: 'green',
      cancelText: '有',
      cancelColor: 'red',
      success: (res) => {
        if (res.confirm) {
          // 同意
          wx.navigateTo({
            url: '/pages/user/propertypay/propertypay?report_id=' + id
          })
        }
      }
    })
  }

})