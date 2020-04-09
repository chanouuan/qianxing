// pages/user/tips/tips.js

Page({

  data: {
    phone: '',
    second: 5,
    clearTimeThread: null
  },

  onLoad(options) {
    this.data.phone = options.phone || '12328'
    this.data.clearTimeThread = setInterval(() => {
      if (this.data.second > 0) {
        this.setData({
          second: this.data.second - 1
        })
      } else {
        clearInterval(this.data.clearTimeThread)
        this.customeCall()
      }
    }, 1000)
  },

  onUnload() {
    clearInterval(this.data.clearTimeThread)
  },

  onHide() {
    clearInterval(this.data.clearTimeThread)
    this.setData({
      second: 0
    })
  },

  customeCall() {
    // 打电话
    if (this.data.second > 0) {
      clearInterval(this.data.clearTimeThread)
      this.setData({
        second: 0
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.phone
      })
    }
  },

  golist () {
    // 事故中心
    wx.switchTab({
      url: '/pages/mine/mine'
    })
  },

  gohome () {
    // 首页
    wx.switchTab({
      url: '/pages/index/index'
    })
  }

})