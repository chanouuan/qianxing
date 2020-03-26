//app.js
const amapFile = require('./utils/amap-wx.js')
const config = require('./config.js')

App({
  onLaunch: function () {
    // 清空缓存
    wx.clearStorage()

    // 系统参数
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.screenHeight = res.screenHeight
        this.globalData.windowHeight = res.windowHeight
      }
    })

    // 管理更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (res) {
      // 新版本下载失败
      console.log(res)
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // Object.assign(this.globalData.userInfo || {}, res.userInfo)
        // wx.setStorageSync('token', null)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 高德地图API
    this.globalData.amapFun = new amapFile.AMapWX({
      key: config.geoKey
    })
  },
  globalData: {
    statusBarHeight: 20,
    screenHeight: 0,
    windowHeight: 0,
    userInfo: null,
    canIUseByGetUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    selectTabIndex: 0
  },
  getUserInfo () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve({
          userInfo: this.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.globalData.canIUseByGetUserInfo) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        this.userInfoReadyCallback = res => {
          resolve({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, res.userInfo)
            resolve({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          },
          fail: res => {
            reject(res)
          }
        })
      }
    })
  },
  getTabBarList () {
    return config.tabBar1
  }
})