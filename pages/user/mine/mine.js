// pages/mine/mine.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarData: {
      leftFont: 'home1'
    },
    goPath: '/pages/user/index/index',
    userInfo: {},
    authModalFlag: false,
    idCardCheckModalFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 我的案件
   */
  tapOrder () {
    if (this.data.userInfo.idcard) {
      // 身份证存在才进行验证
      this.setData({
        idCardCheckModalFlag: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/orders/orders'
      })
    }
  },

  /**
   * 切换管理
   */
  changeLaw () {

  },

  /**
   * 绑定手机/打开登录弹窗
   */
  bindPhone (e) {
    this.setData({
      authModalFlag: true
    })
  },

  /**
   * 关闭身份证验证框
   */
  closeIdcardCheckModal () {
    this.setData({
      idCardCheckModalFlag: false
    })
  },

  /**
   * 身份证验证
   */
  idcardCheckOk(e) {
    this.setData({
      idCardCheckModalFlag: false
    })
    if (this.data.userInfo.idcard && this.data.userInfo.idcard.substr(-4) === e.detail.idcard) {
      // 验证通过
      wx.navigateTo({
        url: '/pages/user/orders/orders'
      })
    } else {
      wx.showToast({
        title: '验证不通过',
        icon: 'none'
      })
    }
  },

  /**
  * 关闭登录弹窗
  */
  closeAuthModal () {
    this.setData({
      authModalFlag: false
    })
  },

  /**
   * 绑定成功
   */
  bindOk () {
    this.setData({
      authModalFlag: false,
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 关于我们
   */
  handleAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  /**
   * 拨打客服电话
   */
  customeCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
  }

})