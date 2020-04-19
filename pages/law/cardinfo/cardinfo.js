// pages/law/cardinfo/cardinfo.js

const api = require('../../../api/api.js')

const findIndex = (arr, id) => {
  for (let i = 0, j = arr.length; i < j; i++) {
    if (arr[i].id == id) {
      return i
    }
  }
  return 0
}

Page({

  data: {
    keyboardFlag: false,
    report_id: 0,
    submit: false,
    carTypeItems: [{ id: 0, name: '请选择' }],
    carTypeIndex: 0,
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
      data_type: 'card'
    }).then(res => {
      wx.hideLoading()
      this.data.form = {
        addr: res.addr,
        full_name: res.full_name,
        idcard: res.idcard,
        gender: res.gender,
        birthday: res.birthday || '',
        plate_num: res.plate_num,
        telephone: res.user_mobile,
        car_type: res.car_type
      }
      this.data.carTypeItems = this.data.carTypeItems.concat(res.car_type_list)
      this.setData({
        carTypeItems: this.data.carTypeItems,
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.form.car_type),
        form: this.data.form
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
      'form.plate_num': e.detail.license_num.join('')
    })
  },

  birthdayChange(e) {
    this.setData({
      'form.birthday': e.detail.value
    })
  },

  carTypeChange(e) {
    this.data.form.car_type = this.data.carTypeItems[e.detail.value].id
    this.setData({
      carTypeIndex: e.detail.value
    })
  },

  tapCardinfo(e) {
    // 信息提交
    if (this.data.submit) {
      return
    }
    if (!e.detail.value.full_name) {
      wx.showToast({
        title: '请输入当事人姓名',
        icon: 'none'
      })
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
      let routes = getCurrentPages()
      routes.forEach(route => {
        if (~route.route.indexOf('reportfile')) {
          // 跳转到勘验笔录
          route.onClickTab({
            detail: {
              current: 1
            }
          })
        }
      })
      wx.navigateBack()
    }).catch(err => {
      console.log(err)
      this.setData({
        submit: false
      })
    })
  }

})