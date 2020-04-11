// pages/setting/setting.js

const app = getApp()
const api = require('../../api/api.js')

Page({

  data: {
    authModalFlag: false,
    userInfo: {}
  },

  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  saveUserInfo(e) {
    // 更新用户信息
    let name = e.currentTarget.dataset.name
    let value = name === 'allow_notice' ? ~~e.detail.value : e.detail.value
    if (value === '' || this.data.userInfo[name] == value) {
      return
    }
    api.saveUserInfo({
      [name]: value
    }).then(res => {
      app.globalData.userInfo[name] = value
      this.data.userInfo[name] = value
    }).catch(err => {})
  },

  changePhone() {
    // 修改手机号
    this.setData({
      authModalFlag: true
    })
  },

  closeAuthModal() {
    // 关闭登录弹窗
    this.setData({
      authModalFlag: false
    })
  },

  bindAuthOk() {
    // 绑定成功
    this.setData({
      authModalFlag: false,
      userInfo: app.globalData.userInfo
    })
  }
})