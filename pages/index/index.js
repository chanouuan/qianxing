//index.js

const app = getApp()
const api = require('../../api/api.js')

Page({
  data: {
    userInfo: {},
    templateId: null,
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919918066&di=f700df53680f64291c73e8bf52b145a4&imgtype=0&src=http%3A%2F%2Fimg.sccnn.com%2Fbimg%2F341%2F16583.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919385252&di=303e99c49b4226444b306e37eef9341a&imgtype=0&src=http%3A%2F%2Fwww.he-bei.cn%2Fuploads%2Fallimg%2Fc200217%2F15Q914cO0-B614.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919641265&di=6ae0797a17b3694a1eed72035c653bdc&imgtype=0&src=http%3A%2F%2Fn8.cmsfile.pg0.cn%2Fgroup1%2FM00%2F05%2FBE%2FCgoOEF44uECAcjmtAAGG93HQVEs970.jpg'
    ]
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...'
    })
    // 获取用户信息
    app.login().then(data => {
      wx.hideLoading({
        complete: (res) => {
          this.loadInit(data)
        }
      })
    }).catch(res => {
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
      this.setData({
        templateId: app.globalData.templateId
      })
    }
  },

  loadInit(data) {
    // 初始化加载
    api.getUserCount().then(res => {
      data.userInfo.report_count = res.report_count
      this.setData(data, () => {
        this.tapLawApp()
      })
    }).catch(err => {
      this.setData(data, () => {
        this.tapLawApp()
      })
    })
  },

  tapLawApp() {
    // 进入管理端
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
  }
})