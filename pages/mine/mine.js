// pages/mine/mine.js

//获取应用实例
const app = getApp()
const api = require('../../api/api.js')

Page({

  data: {
    navbarData: {
      leftFont: 'home1'
    },
    userInfo: {},
    templateId: 'user',
    authModalFlag: false,
    idCardCheckModalFlag: false
  },

  onLoad: function (options) {
    //
  },

  onShow () {
    // tabbar 回显
    this.getTabBar().switchPage(1)
    // 初始化数据
    if (app.globalData.templateId === 'law') {
      api.getUserCount().then(data => {
        this.setData({
          userInfo: Object.assign(app.globalData.userInfo, {
            case_count: data.case_count,
            patrol_km: data.patrol_km,
            city_rank: data.city_rank
          }),
          templateId: app.globalData.templateId
        })
      }).catch(err => {})
    } else {
      this.setData({
        userInfo: app.globalData.userInfo,
        templateId: app.globalData.templateId
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapWork() {
    // 我的工作
    wx.navigateTo({
      url: '/pages/law/usercount/usercount',
    })
  },

  tapOrder () {
    // 我的案件
    if (this.data.templateId === 'law') {
      // 管理端
      wx.navigateTo({
        url: '/pages/law/reportevents/reportevents'
      })
    } else {
      if (this.data.userInfo.idcard) {
        // 身份证存在才进行验证
        this.setData({
          idCardCheckModalFlag: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/user/reportevents/reportevents'
        })
      }
    }
  },

  changeLaw () {
    // 进入管理
    if (this.data.templateId === 'law') {
      // 进入用户端
      this.getTabBar().switchMenu('user')
    } else {
      // 进入管理端
      this.getTabBar().switchMenu('law')
    }
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  bindPhone (e) {
    // 绑定手机/打开登录弹窗
    if (!this.data.userInfo.telephone) {
      this.setData({
        authModalFlag: true
      })
    }
  },

  closeIdcardCheckModal () {
    // 关闭身份证验证框
    this.setData({
      idCardCheckModalFlag: false
    })
  },

  idcardCheckOk(e) {
    // 身份证验证
    this.setData({
      idCardCheckModalFlag: false
    })
    if (this.data.userInfo.idcard && this.data.userInfo.idcard.substr(-4) === e.detail.idcard) {
      // 验证通过
      wx.navigateTo({
        url: '/pages/user/reportevents/reportevents'
      })
    } else {
      wx.showToast({
        title: '验证不通过',
        icon: 'none'
      })
    }
  },

  closeAuthModal () {
    // 关闭登录弹窗
    this.setData({
      authModalFlag: false
    })
  },

  bindOk () {
    // 绑定成功
    this.setData({
      authModalFlag: false,
      userInfo: app.globalData.userInfo
    })
  },

  handleAbout() {
    // 关于我们
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  onSetting() {
    // 设置
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  }

})