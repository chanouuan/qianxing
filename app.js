//app.js
const QQMapWX = require('./utils/qqmap-wx-jssdk.min.js')
const config = require('./config.js')
const util = require('./utils/util.js')
const api = require('./api/api.js')

App({
  onLaunch: function () {
    // 清空缓存
    wx.clearStorage()

    // 云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'http-method-k3d5g',
        traceUser: true
      })
    }

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
      if (res.hasUpdate) {
        wx.showToast({
          title: '正在准备更新新版本！',
          icon: 'none'
        })
      }
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
      wx.showToast({
        title: '新版本下载失败！',
        icon: 'none'
      })
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

    // QQ地图API
    this.globalData.qqmapsdk = new QQMapWX({
      key: config.qqmapKey
    })

    // 客服电话
    this.globalData.phone = config.phone
  },
  globalData: {
    statusBarHeight: 20,
    screenHeight: 0,
    windowHeight: 0,
    customTabBarTemplateId: 'user',
    userInfo: null,
    phone: ''
  },
  login () {
    return new Promise((resolve, reject) => {
      this.getUserInfo().then(userInfo => {
        if (userInfo.token) {
          resolve({ userInfo })
          return
        }
        // 登录
        wx.login({
          success: res => {
            userInfo.code = res.code
            api.login(userInfo).then(res => {
              this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, res)
              util.setToken(res.token)
              resolve({
                userInfo: this.globalData.userInfo
              })
            }).catch(res => {
              reject(res)
            })
          }
        })
      }).catch(res => {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
        reject(res)
      })
    })
  },
  getUserInfo () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else if (wx.canIUse('button.open-type.getUserInfo')) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        this.userInfoReadyCallback = res => {
          this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, res.userInfo)
          resolve(this.globalData.userInfo)
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, res.userInfo)
            resolve(this.globalData.userInfo)
          },
          fail: res => {
            reject(res)
          }
        })
      }
    })
  }
})