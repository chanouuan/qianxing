// pages/user/tips/tips.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: app.globalData.phone
    })
  },

  customeCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
  },

  golist () {
    wx.switchTab({
      url: '/pages/mine/mine'
    })
  },

  gohome () {
    wx.switchTab({
      url: '/pages/user/index/index'
    })
  }

})