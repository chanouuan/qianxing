// pages/user/reportevents/reportevents.js

const api = require("../../../api/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    loading: false,
    isEmpty: false,
    datalist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList()
  },

  loadList () {
    wx.showNavigationBarLoading()
    this.setData({
      loading: true
    })
    api.getUserReportEvents(this.data.form).then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (res.list.length) {
        this.setData({
          loading: false,
          isEmpty: false,
          datalist: this.data.datalist.concat(res.list)
        })
        this.data.form.lastpage = res.lastpage
      } else {
        this.setData({
          loading: false,
          isEmpty: true
        })
      }
    }).catch(err => {
      wx.hideNavigationBarLoading()
    })
  },

  onPullDownRefresh () {
    this.data.form.lastpage = ''
    this.data.datalist = []
    this.loadList()
  },

  onReachBottom() {
    this.loadList()
  },

  onClickTab (e) {
    if (e.detail.current === 0) {
      // 全部案件
      this.data.form.status = ''
    }
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.onPullDownRefresh()
  },

  handleStep1 () {
    // 自主处理 1
    wx.showModal({
      title: '',
      content: '请你在申请自主处理前，在“查看文书”栏中对道路赔补偿通知书内容及结果进行确认，是否同意结果？',
      confirmText: '同意',
      confirmColor: 'green',
      cancelText: '不同意',
      cancelColor: 'red',
      success: (res) => {
        if (res.confirm) {
          this.handleStep2()
        }
      }
    })
  },

  handleStep2() {
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
          this.handleStep3()
        }
      }
    })
  },

  handleStep3() {
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
        }
      }
    })
  }

})