const api = require('../../../api/api.js')

Page({

  data: {
    report_id: 0,
    datainfo: {}
  },

  onLoad: function (options) {
    this.setData({
      report_id: options.report_id
    })
    // 获取案件信息
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'show'
    }).then(res => {
      this.setData({
        datainfo: res
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      wx.navigateBack()
    })
  }

})