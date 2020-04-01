// pages/law/cardinfo/cardinfo.js

const api = require('../../../api/api.js')

Page({

  data: {
    keyboardFlag: false,
    licenseList: [],
    report_id: 0,
    submit: false,
    form: {}
  },

  onLoad (options) {
    this.data.report_id = options.report_id
    // 获取案件信息
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'info'
    }).then(res => {
      wx.hideLoading()
      this.setData({
        licenseList: res.plate_num ? res.plate_num.split('') : [],
        form: {
          addr: res.addr,
          full_name: res.full_name,
          idcard: res.idcard,
          gender: res.gender,
          birthday: res.birthday || '',
          plate_num: res.plate_num,
          telephone: res.user_mobile
        }
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  handleShowKeyboard() {
    // 打开键盘
    this.setData({
      keyboardFlag: true
    })
  },

  handleCloseKeyboard() {
    // 关闭键盘
    this.setData({
      keyboardFlag: false
    })
  },

  handleSetLicense(e) {
    // 键盘组件中拿到车牌号
    this.setData({
      'form.plate_num': e.detail.license_num.join(''),
      licenseList: e.detail.license_num
    })
  },

  birthdayChange(e) {
    this.setData({
      'form.birthday': e.detail.value
    })
  },

  tapCardinfo(e) {
    // 信息提交
    if (this.data.submit) {
      return
    }
    if (!/^1[0-9]{10}$/.test(e.detail.value.telephone)) {
      wx.showToast({
        title: '请输入正确的当事人手机号',
        icon: 'none'
      })
      return
    }
    this.setData({
      submit: true
    })
    e.detail.value.report_id = this.data.report_id
    api.cardInfo(e.detail.value).then(res => {
      wx.navigateBack()
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  }

})