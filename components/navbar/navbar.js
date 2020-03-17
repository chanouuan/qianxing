// components/navbar/navbar.js

//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navbarData: {
      type: Object,
      value: {}
    },
    goPath: {
      type: 'string'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 20
  },

  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached: function () {
      this.setData({
        height: app.globalData.statusBarHeight, // 定义导航栏的高度
        navbarData: {
          bgColor: this.data.navbarData.bgColor || false,
          leftFont: this.data.navbarData.leftFont || 'fanhui1',
          leftFontColor: this.data.navbarData.leftFontColor || '#FFF',
          title: this.data.navbarData.title || '',
          titleColor: this.data.navbarData.titleColor || '#FFF',
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回上一页面
    navLeftTap () {
      if (~this.data.navbarData.leftFont.indexOf('fanhui')) {
        wx.navigateBack()
      } else if (~this.data.navbarData.leftFont.indexOf('home')) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }
  }
})
