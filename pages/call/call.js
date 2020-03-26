// pages/call.js
const coordtransform = require('coordtransform')

const app = getApp()

// 格式化定位位置
const formatAmapAddress = (data) => {
  if (!data.length) return '未知'
  data = data[0]
  if (!data['regeocodeData']) return data.name
  data = data['regeocodeData']
  let addr = data['formatted_address']
  addr = addr.replace(data['addressComponent']['province'], '')
  addr = addr.replace(data['addressComponent']['city'], '')
  addr = addr.replace(data['addressComponent']['district'], '')
  return addr
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageFlag: false,
    authModalFlag: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    app.getUserInfo().then(res => {
      this.setData(res)
      if (this.data.userInfo.telephone || 1) {
        this.amapPostion().then(() => {
          this.setData({
            pageFlag: true
          })
        })
        
      } else {
        this.setData({
          pageFlag: false,
          authModalFlag: true
        }, () => {
          wx.hideNavigationBarLoading()
        })
      }
    })
  },

  /**
   * 定位
   */
  amapPostion () {
    wx.showNavigationBarLoading()
    return new Promise((resolve, reject) => {
      app.globalData.amapFun.getRegeo({
        success: (data) => {
          this.setData({
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            address: formatAmapAddress(data),
            markers: [
              {
                latitude: data[0].latitude,
                longitude: data[0].longitude,
                width: '34px',
                height: '34px'
              }
            ]
          }, () => {
            wx.hideNavigationBarLoading()
            resolve()
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '获取地理位置失败' + res,
            icon: 'none'
          })
          wx.hideNavigationBarLoading()
          reject()
        }
      })
    })
  },

  /**
   * 关闭授权弹窗
   */
  handleCloseModal () {
    this.setData({
      authModalFlag: false
    }, () => {
      wx.navigateBack()
    })
  },

  /**
   * 绑定授权成功
   */
  handleBindOk () {
    
  },

  /**
   * 获取中心位置坐标
   */
  getCenterLocation (e) {
    var that = this;
    e = e ? e : ''
    if (!(e.type == 'end' && e.causedBy == 'drag')) {
      return
    }
    // 动画
    this.animate('#center-location', [
      { translateY: 0},
      { translateY: -10},
      { translateY: 0},
    ], 500)
    // 中心点坐标
    const mapCtx = wx.createMapContext('map', this)
    wx.showNavigationBarLoading()
    mapCtx.getCenterLocation({
      success: res => {
        app.globalData.amapFun.getRegeo({
          location: res.longitude + ',' + res.latitude,
          success: (data) => {
            this.setData({
              address: formatAmapAddress(data)
            }, () => {
              wx.hideNavigationBarLoading()
            })
          }
        })
      }
    })
  },

  /**
   * 拨打客服电话
   */
  customeCall () {
    wx.makePhoneCall({
      phoneNumber: '400'
    })
  },

  /**
   * 重置定位
   */
  getNowLocation () {
    this.amapPostion()
  }
})