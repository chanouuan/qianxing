// pages/law/usercount/usercount.js

const api = require('../../../api/api.js')

Page({

  data: {
    userInfo: {}
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })
    api.getUserCount().then(data => {
      this.setData({
        userInfo: data
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {})
  }
})