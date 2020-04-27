//app.js
import QQMapWX from './utils/qqmap-wx-jssdk.min.js'
import {
  qqmapKey
} from './config.js'
import {
  setToken,
  getToken
} from './utils/util.js'
import {
  mplogin
} from './api/api.js'

App({
  onLaunch: function () {
    // 清空缓存
    setToken('')
    // wx.clearStorage()

    // 云开发
    // if (wx.cloud) {
    //   wx.cloud.init({
    //     env: 'http-method-k3d5g',
    //     traceUser: true
    //   })
    // }

    // 系统参数
    wx.getSystemInfo({
      success: res => {
        this.globalData.isIpx = res.model.search('iPhone X') !== -1
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

    // QQ地图API
    this.globalData.qqmapsdk = new QQMapWX({
      key: qqmapKey
    })
  },
  globalData: {
    statusBarHeight: 20,
    screenHeight: 0,
    windowHeight: 0,
    isIpx: false,
    templateId: 'user',
    userInfo: {}
  },
  login() {
    return new Promise((resolve, reject) => {
      if (getToken()) {
        resolve({
          userInfo: this.globalData.userInfo
        })
      } else {
        wx.login({
          success: res => {
            mplogin({
              code: res.code
            }).then(res => {
              this.globalData.userInfo = res
              setToken(res.token)
              resolve({
                userInfo: this.globalData.userInfo
              })
            }).catch(err => {
              reject(err)
            })
          }
        })
      }
    })
  }
})