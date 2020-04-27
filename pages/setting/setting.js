// pages/setting/setting.js

const app = getApp()
const api = require('../../api/api.js')

Page({

  data: {
    authModalFlag: false,
    userInfo: {},
    templateId: 'user'
  },

  onLoad(options) {
    this.data.userInfo = app.globalData.userInfo
    if (this.data.userInfo.group_id > 0 && app.globalData.templateId === 'law') {
      api.getUserProfile().then(res => {
        this.data.userInfo.law_num = res.law_num
        this.setData({
          userInfo: this.data.userInfo,
          templateId: app.globalData.templateId
        })
      }).catch(err => {})
    } else {
      this.setData({
        userInfo: this.data.userInfo,
        templateId: app.globalData.templateId
      })
    }
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