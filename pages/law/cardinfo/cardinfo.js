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
    form: {},
    currentPlateNum: '',
    plate_num: '',
    plate_num_list: []
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
      this.data.form = {
        addr: res.addr,
        full_name: res.full_name,
        idcard: res.idcard,
        gender: res.gender,
        birthday: res.birthday || '',
        telephone: res.user_mobile,
        car_type: res.car_type
      }
      this.data.plate_num_list = res.plate_num ? res.plate_num.split(',') : []
      this.data.carTypeItems = this.data.carTypeItems.concat(res.car_type_list)
      this.setData({
        carTypeItems: this.data.carTypeItems,
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.form.car_type),
        form: this.data.form,
        plate_num: this.data.plate_num_list.length ? this.data.plate_num_list[0] : '',
        plate_num_list: this.data.plate_num_list
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  addPlateNum() {
    // 增加车牌号
    if (this.data.plate_num_list.length < 20) {
      this.setData({
        ['plate_num_list[' + (this.data.plate_num_list.length) + ']']: ''
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '最多可增加20个车牌号'
      })
    }
  },

  removePlateNum(e) {
    // 移除车牌号
    this.data.plate_num_list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      plate_num_list: this.data.plate_num_list
    })
  },

  handleShowKeyboard(e) {
    // 打开键盘
    this.data.currentPlateNum = e.currentTarget.dataset.index
    this.setData({
      plate_num: this.data.plate_num_list[this.data.currentPlateNum],
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
    if (this.data.currentPlateNum !== '') {
      this.setData({
        ['plate_num_list[' + this.data.currentPlateNum + ']']: e.detail.license_num.join('')
      })
    }
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
    let data = e.detail.value
    if (!data.full_name) {
      wx.showToast({
        title: '请输入当事人姓名',
        icon: 'none'
      })
      return
    }
    if (!/^1[0-9]{10}$/.test(data.telephone)) {
      wx.showToast({
        title: '请输入正确的当事人手机号',
        icon: 'none'
      })
      return
    }
    this.setData({
      submit: true
    })
    data.report_id = this.data.report_id
    data.plate_num = this.data.plate_num_list.join(',')
    api.cardInfo(data).then(res => {
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
      this.setData({
        submit: false
      })
    })
  }

})