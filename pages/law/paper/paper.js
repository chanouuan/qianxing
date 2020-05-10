
const api = require('../../../api/api.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    pageFlag: false,
    inputFlag: false,
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
      res.checker_time = res.checker_time ? util.splitTime(res.checker_time) : {}
      res.agent_time = res.agent_time ? util.splitTime(res.agent_time) : {}
      res.involved_action = res.involved_action || {}
      res.involved_action_type = res.involved_action_type || {}
      res.items = res.items.map((n,i) => (i+1) + '. ' + n.name + n.amount + n.unit).join('；')
      res.items = res.items ? res.items + '（以下空白）。' : ''
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
          let data = {
            ['datainfo.' + res.signatureTarget]: res.imageUrl
          }
          if (res.signatureTarget == 'signature_checker') {
            data['datainfo.checker_time'] = this.data.date
          }
          if (res.signatureTarget == 'signature_agent') {
            data['datainfo.agent_time'] = this.data.date
          }
          if (res.signatureTarget == 'signature_invitee') {
            // 输入邀请人手机号
            data['inputFlag'] = true
          }
          this.setData(data)
        }
      }
    })
  },

  closeInputModal(e) {
    // 关闭弹框
    this.setData({
      inputFlag: false
    })
  },

  inputOk(e) {
    // 输入邀请人手机号成功
    let value = e.detail.value
    if (!value) {
      wx.showToast({
        icon: 'none',
        title: '未输入手机号'
      })
      this.setData({
        inputFlag: false
      })
      return
    }
    if (!/^1[0-9]{10}$/.test(value)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    this.setData({
      inputFlag: false
    })
    wx.showLoading({
      title: '提交中...'
    })
    api.saveReportInfo({
      report_id: this.data.report_id,
      invitee_mobile: value
    }).then(res => {
      wx.hideLoading({
        complete: () => {
          this.setData({
            ['datainfo.invitee_mobile']: value
          })
        }
      })
    }).catch(err => {})
  },

  tapSave() {
    // 进行下一步
    wx.navigateBack({
      delta: 2 // 后退2页
    })
  }
})