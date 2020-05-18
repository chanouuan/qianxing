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
    carTypeItems: [{
      id: 0,
      name: '请选择'
    }],
    carTypeIndex: 0,
    currentPlateNum: '',
    person_index: 0,
    persons: []
  },

  onLoad(options) {
    this.data.report_id = options.report_id
    // 获取案件信息
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'card'
    }).then(res => {
      this.data.persons = res.persons || []
      this.data.persons = this.data.persons.map(n => {
        n.plate_num = n.plate_num ? n.plate_num.split(',') : []
        return n
      })
      this.data.carTypeItems = this.data.carTypeItems.concat(res.car_type_list)
      this.setData({
        carTypeItems: this.data.carTypeItems,
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.persons[this.data.person_index].car_type),
        persons: this.data.persons
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  changeinput(e) {
    // input
    this.setData({
      ['persons[' + this.data.person_index + '].' + e.currentTarget.dataset.name]: e.detail.value
    })
  },

  addPlateNum() {
    // 增加车牌号
    if (this.data.persons[this.data.person_index].plate_num.length < 20) {
      this.setData({
        ['persons[' + this.data.person_index + '].plate_num[' + (this.data.persons[this.data.person_index].plate_num.length) + ']']: ''
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '不能增加更多车牌号了'
      })
    }
  },

  removePlateNum(e) {
    // 移除车牌号
    this.data.persons[this.data.person_index].plate_num.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      ['persons[' + this.data.person_index + '].plate_num']: this.data.persons[this.data.person_index].plate_num
    })
  },

  handleShowKeyboard(e) {
    // 打开键盘
    this.data.currentPlateNum = e.currentTarget.dataset.index
    this.setData({
      currentPlateNum: this.data.currentPlateNum,
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
        ['persons[' + this.data.person_index + '].plate_num[' + this.data.currentPlateNum + ']']: e.detail.license_num.join('')
      })
    }
  },

  carTypeChange(e) {
    this.data.persons[this.data.person_index].car_type = this.data.carTypeItems[e.detail.value].id
    this.setData({
      carTypeIndex: e.detail.value
    })
  },

  selectPerson(e) {
    // 选择当事人
    let index = e.currentTarget.dataset.index
    this.setData({
      person_index: index,
      carTypeIndex: findIndex(this.data.carTypeItems, this.data.persons[index].car_type)
    })
  },

  tapCardinfo() {
    // 信息提交
    if (this.data.submit) {
      return
    }
    let data = [].concat(this.data.persons)
    for (let i = 0, j = data.length; i < j; i++) {
      let h = '第' + (i + 1) + '个当事人,'
      if (!data[i].plate_num.length) {
        wx.showToast({
          title: h + '未输入车牌号',
          icon: 'none'
        })
        return
      }
      if (!data[i].full_name) {
        wx.showToast({
          title: h + '未输入姓名',
          icon: 'none'
        })
        return
      }
      if (!/^1[0-9]{10}$/.test(data[i].user_mobile)) {
        wx.showToast({
          title: h + '未输入正确的手机号',
          icon: 'none'
        })
        return
      }
    }
    this.setData({
      submit: true
    })
    api.cardInfo({
      report_id: this.data.report_id,
      data: data
    }).then(res => {
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