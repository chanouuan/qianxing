// pages/user/reportevents/reportevents.js

const api = require("../../../api/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      islaw: 1
    },
    trunFlag: false,
    trunParam: {},
    tabIndex: 0,
    isEnd: false,
    isEmpty: false,
    datalist: []
  },

  onLoad: function(options) {

  },

  onShow() {
    this.reloadList()
  },

  loadList() {
    wx.showNavigationBarLoading()
    let promise = null
    if (this.data.tabIndex === 0) {
      promise = api.getUserReportEvents(this.data.form)
    } else {
      promise = api.getReportEvents(this.data.form)
    }
    promise.then(res => {
      if (res.list.length) {
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

  position(e) {
    // 打开定位
    let location = this.data.datalist[e.currentTarget.dataset.index].location
    if (location) {
      location = location.split(',')
      wx.openLocation({
        latitude: parseFloat(location[1]),
        longitude: parseFloat(location[0])
      })
    }
  },

  callUser(e) {
    // 拨打报警人电话
    let tel = this.data.datalist[e.currentTarget.dataset.index].user_mobile
    if (tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      })
    }
  },

  turnReport(e) {
    // 移交案件
    let id = ~~e.currentTarget.dataset.id
    let level = ~~e.currentTarget.dataset.level
    this.setData({
      trunFlag: true,
      trunParam: { id, level }
    })
  },

  closeTrunModal(e) {
    // 关闭移交弹框
    this.setData({
      trunFlag: false
    })
  },

  trunOk(e) {
    // 移交成功
    this.setData({
      trunFlag: false
    })
    if (!e.detail.value) {
      wx.showToast({
        icon: 'none',
        title: '未选择移交方'
      })
      return
    }
    wx.showLoading({
      title: '移交中...'
    })
    api.trunReport({
      level: e.detail.level,
      report_id: e.detail.id,
      target_id: e.detail.value
    }).then(res => {
      wx.hideLoading()
      this.reloadList()
    }).catch(err => {})
  },

  acceptReport(e) {
    // 案件受理
    let id = ~~e.currentTarget.dataset.id
    wx.showModal({
      title: '案件受理',
      content: '请确认是否受理此案件？',
      confirmText: '同意',
      confirmColor: 'green',
      cancelText: '不同意',
      cancelColor: 'red',
      success: (res) => {
        if (res.confirm) {
          api.acceptReport({ report_id: id }).then(res => {
            // 切换到已受理列表
            this.onClickTab({
              detail: {
                current: 1
              }
            })
            wx.showToast({
              icon: 'none',
              title: '已受理案件'
            })
          }).catch(err => {})
        }
      }
    })
  },

  reloadReport(e) {
    // 案件处置-信息报送
    let id = ~~e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/law/reportinfo/reportinfo?report_id=' + id
    })
  },

  deletereport(e) {
    // 删除报案
    let id = ~~e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '是否确认删除该报案？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          api.deleteReport({
            report_id: id,
          }).then(res => {
            this.reloadList()
          }).catch(err => { })
        }
      }
    })
  }

})