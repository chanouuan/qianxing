// components/tabbar/tabbar.js

const app = getApp()

Component({

  data: {
    selected: 0,
    list: []
  },

  lifetimes: {
    attached: function () {
      this.setData({
        selected: app.globalData.selectTabIndex
      })
      this.setData(app.getTabBarList())
    }
  },

  methods: {
    switchTab (e) {
      const data = e.currentTarget.dataset
      const url = data.path
      app.globalData.selectTabIndex = data.index
      this.setData({
        selected: data.index
      })
      wx.redirectTo({ url })
    }
  }
})
