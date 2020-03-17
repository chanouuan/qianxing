//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    weather: false,
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919918066&di=f700df53680f64291c73e8bf52b145a4&imgtype=0&src=http%3A%2F%2Fimg.sccnn.com%2Fbimg%2F341%2F16583.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919385252&di=303e99c49b4226444b306e37eef9341a&imgtype=0&src=http%3A%2F%2Fwww.he-bei.cn%2Fuploads%2Fallimg%2Fc200217%2F15Q914cO0-B614.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583919641265&di=6ae0797a17b3694a1eed72035c653bdc&imgtype=0&src=http%3A%2F%2Fn8.cmsfile.pg0.cn%2Fgroup1%2FM00%2F05%2FBE%2FCgoOEF44uECAcjmtAAGG93HQVEs970.jpg'
    ]
  },
  onLoad () {
    // 获取用户信息
    app.getUserInfo().then(res => {
      console.log(res)
      this.setData(res)
    }).catch(res => {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none',
        duration: 2000
      })
    })

    app.globalData.amapFun.getWeather({
      success: (data) => {
        this.setData({
          weather: data
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none'
        })
        this.setData({
          weather: JSON.parse('{"city":{"text":"城市","data":"汇川区"},"weather":{"text":"天气","data":"阴"},"temperature":{"text":"温度","data":"16"},"winddirection":{"text":"风向","data":"东北风"},"windpower":{"text":"风力","data":"≤3级"},"humidity":{"text":"湿度","data":"70%"},"liveData":{"province":"贵州","city":"汇川区","adcode":"520303","weather":"阴","temperature":"16","winddirection":"东北","windpower":"≤3","humidity":"70","reporttime":"2020-03-12 15:24:55"}}')
        })
      }
    })
  },

  /**
   * 更多应用
   */
  moreApp () {
    wx.navigateTo({
      url: '/pages/more/more'
    })
  }
})
