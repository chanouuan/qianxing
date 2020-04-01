const api = require('../../../api/api.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageFlag: false,
    authModalFlag: false,
    userInfo: {},
    address: '',
    latitude: 0, // 27.48074
    longitude: 0, // 106.375
    form: {},
    submit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (this.data.userInfo.telephone) {
      this.mapPostion().then(() => {
        this.setData({
          pageFlag: true
        })
      })
    } else {
      this.setData({
        pageFlag: false,
        authModalFlag: true
      })
    }
  },

  mapPostion () {
    // 定位
    wx.showNavigationBarLoading()
    return new Promise((resolve, reject) => {
      app.globalData.qqmapsdk.reverseGeocoder({
        success: (res) => {
          res = res.result
          this.data.form = {
            location: res.location.lng + ',' + res.location.lat,
            address: res.formatted_addresses.recommend,
            adcode: res.ad_info.adcode,
            district: res.ad_info.district,
            city: res.ad_info.city
          }
          this.setData({
            latitude: res.location.lat,
            longitude: res.location.lng,
            address: res.formatted_addresses.recommend
          }, () => {
            resolve()
          })
        },
        fail: (err) => {
          wx.showToast({
            title: '获取地理位置失败' + err,
            icon: 'none'
          })
          reject()
        },
        complete: (res) => {
          wx.hideNavigationBarLoading()
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
    this.mapPostion().then(() => {
      this.setData({
        pageFlag: true,
        authModalFlag: false,
        userInfo: app.globalData.userInfo
      })
    })
  },

  /**
   * 获取中心位置坐标
   */
  getCenterLocation (e) {
    if (!(e.type == 'end' && e.causedBy == 'drag')) {
      return
    }
    // 中心点坐标
    const mapCtx = wx.createMapContext('map', this)
    wx.showNavigationBarLoading()
    mapCtx.getCenterLocation({
      success: res => {
        app.globalData.qqmapsdk.reverseGeocoder({
          location: res.latitude + ',' + res.longitude,
          success: (res) => {
            res = res.result
            this.data.form = {
              location: res.location.lng + ',' + res.location.lat,
              address: res.formatted_addresses.recommend,
              adcode: res.ad_info.adcode,
              district: res.ad_info.district,
              city: res.ad_info.city
            }
            this.setData({
              address: res.formatted_addresses.recommend,
              animation: true
            })
          },
          fail: (err) => {
            wx.showToast({
              title: '获取地理位置失败' + err,
              icon: 'none'
            })
          },
          complete: (res) => {
           wx.hideNavigationBarLoading()
          }
        })
      }
    })
  },

  /**
   * 地图控件动画结束
   */
  onMarkerAnimationend () {
    this.setData({
      animation: false
    })
  },

  /**
   * 拨打客服电话
   */
  customeCall () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
  },

  /**
   * 重置定位
   */
  getNowLocation () {
    this.mapPostion()
  },

  /**
   * 提交报案
   */
  report () {
    if (this.data.submit) {
      return
    }
    this.setData({
      submit: true
    })
    api.reportEvent(this.data.form).then(res => {
      wx.redirectTo({
        url: '/pages/user/tips/tips'
      })
    }).catch(err => {
      this.setData({
        submit: false
      })
    })    
  }
})