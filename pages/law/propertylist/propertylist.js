const api = require('../../../api/api.js')

Page({

  data: {
    list: []
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })
    api.getPropertyItems({}).then(res => {
      this.setData({
        list: res
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {})
  }
})