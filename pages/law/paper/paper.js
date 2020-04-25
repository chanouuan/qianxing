
const api = require('../../../api/api.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    pageFlag: false,
    report_id: 0,
    date: util.splitTime(new Date()),
    datainfo: {}
  },
  onLoad (options) {
    this.data.report_id = options.report_id
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'paper'
    }).then(res => {
      wx.hideLoading()
      res.check_start_time = util.splitTime(res.check_start_time)
      res.check_end_time = util.splitTime(res.check_end_time)
      res.event_time = util.splitTime(res.event_time)
      res.involved_action = res.involved_action || {}
      res.involved_action_type = res.involved_action_type || {}
      res.items = res.items.map((n,i) => (i+1) + '. ' + n.name + n.amount + n.unit).join('；')
      res.items = [
        res.items.substr(0, 35),
        res.items.substr(35, 40),
        res.items.substr(75)
      ]
      this.setData({
        datainfo: res,
        pageFlag: true
      })
    }).catch(err => {
      console.log(err)
      // 获取失败
      wx.navigateBack()
    })
  },

  tapSign() {
    // 签字
    wx.navigateTo({
      url: '/pages/law/signature/signature?report_id=' + this.data.report_id,
      events: {
        signatureCallBack: (res) => {
          this.setData({
            ['datainfo.' + res.signatureTarget]: res.imageUrl
          })
        }
      }
    })
  },

  tapSave() {
    // 进行下一步
    wx.navigateBack({
      delta: 2 // 后退2页
    })
  }
})