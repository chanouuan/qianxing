//index.js

const app = getApp()
const api = require('../../api/api.js')

Page({
  data: {
    userInfo: {},
    templateId: null,
    banner: []
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取用户信息
    app.login().then(data => {
      wx.hideLoading({
        complete: (res) => {
          this.loadInit(data)
        }
      })
    }).catch(err => {
      wx.hideLoading({
        complete: (res) => {
          app.login().then(data => {
            this.loadInit(data)
          })
        }
      })
    })
  },

  onPullDownRefresh() {
    // 下拉刷新
    app.login().then(data => {
      wx.stopPullDownRefresh({
        complete: (res) => {
          this.loadInit(data)
        },
      })
    }).catch(res => {
      wx.stopPullDownRefresh()
    })
  },

  onShow() {
    // tabbar 回显
    this.getTabBar().switchPage(0)
    // 初始化数据
    if (this.data.userInfo.id) {
      this.loadInit(this.data)
    }
  },

  loadInit(data) {
    // 初始化加载
    if (data.userInfo.group_id > 0) {
      // 自动进入管理端
      if (!this.data.templateId) {
        this.getTabBar().switchMenu('law')
        // wx.showModal({
        //   content: '是否接收报警通知？',
        //   success(res) {
        //     if (res.confirm) {
        //       wx.requestSubscribeMessage({
        //         tmplIds: ['Hq43-ga1Zpadg5ab7ECSHUDdWRqNdGPjUf2fE2_QMLM'],
        //         success (res) {
        //           console.log(res)
        //         },
        //         fail:(err) => {
        //           console.log(err)
        //         }
        //       })
        //     }
        //   }
        // })
      }
    }
    data.templateId = app.globalData.templateId
    if (app.globalData.templateId !== 'law') {
      // 用户端只获取banner图
      if (this.data.banner.length) {
        this.setData(data)
        return
      }
    }
    api.loadData().then(res => {
      data.banner = res.banner
      data.userInfo.report_count = res.report_count
      this.setData(data)
    }).catch(err => {
      this.setData(data)
    })
  },

  tapLawApp() {
    // 点击进入管理端
    if (this.data.userInfo.group_id > 0) {
      this.getTabBar().switchMenu('law')
      this.setData({
        templateId: app.globalData.templateId
      })
    }
  },

  callTap() {
    // 事故报案
    wx.navigateTo({
      url: '/pages/user/report/report'
    })
  },

  moreApp() {
    // 更多应用
    wx.navigateTo({
      url: '/pages/more/more'
    })
  },

  inEvents() {
    // 事故处理
    wx.navigateTo({
      url: '/pages/law/reportevents/reportevents'
    })
  },

  noopen() {
    // 暂未开通
    wx.showToast({
      icon: 'none',
      title: '暂未开通'
    })
  }
})