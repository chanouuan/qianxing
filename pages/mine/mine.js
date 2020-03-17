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
    userInfo: {},
    hasUserInfo: false,
    authModalFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    app.getUserInfo().then(res => {
      this.setData(res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      phoneNumber: '10086'
    })
  }

})