// pages/law/reportinfo/reportinfo.js
const api = require('../../../api/api.js')
const util = require('../../../utils/util.js')
const app = getApp()

const findIndex = (arr, id) => {
  for (let i = 0, j = arr.length; i < j; i++) {
    if (arr[i].id == id) {
      return i
    }
  }
  return 0
}

Page({

  data: {
    report_id: 0,
    submit: false,
    weatherItems: [{ id: 0, name: '请选择' }],
    weatherIndex: 0,
    carTypeItems: [{ id: 0, name: '请选择' }],
    carTypeIndex: 0,
    eventTypeItems: [{ id: 0, name: '请选择' }], // 事件类型
    eventTypeIndex: 0,
    driverStateItems: [{ id: 0, name: '请选择' }], // 受伤情况
    driverStateIndex: 0,
    carStateItems: [{ id: 0, name: '请选择' }], // 车辆情况
    carStateIndex: 0,
    trafficStateItems: [{ id: 0, name: '请选择' }], // 交通情况
    trafficStateIndex: 0,
    colleagueItems: [{ id: 0, name: '请选择' }],
    colleagueIndex: 0,
    datainfo: {
      event_time: null,
      weather: 0,
      car_type: 0,
      address: '',
      stake_number: '',
      event_type: 0,
      driver_state: 0,
      car_state: 0,
      traffic_state: 0,
      colleague_id: 0
    }
  },

  onLoad: function(options) {
    this.setData({
      report_id: options.report_id // 案件ID
    })
    // 获取案件信息
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'info'
    }).then(res => {
      wx.hideLoading()
      this.data.datainfo = {
        location: res.location,
        event_time: res.event_time,
        weather: res.weather,
        car_type: res.car_type,
        address: res.address,
        stake_number: res.stake_number,
        event_type: res.event_type,
        driver_state: res.driver_state,
        car_state: res.car_state,
        traffic_state: res.traffic_state,
        colleague_id: res.colleague_id
      }
      this.data.weatherItems = this.data.weatherItems.concat(res.weather_list)
      this.data.carTypeItems = this.data.carTypeItems.concat(res.car_type_list)
      this.data.eventTypeItems = this.data.eventTypeItems.concat(res.event_type_list)
      this.data.driverStateItems = this.data.driverStateItems.concat(res.driver_state_list)
      this.data.carStateItems = this.data.carStateItems.concat(res.car_state_list)
      this.data.trafficStateItems = this.data.trafficStateItems.concat(res.traffic_state_list)
      this.data.colleagueItems = this.data.colleagueItems.concat(res.colleague_list)
      this.setData({
        'datainfo.event_time': this.data.datainfo.event_time || util.formatTime(new Date()),
        'datainfo.stake_number': this.data.datainfo.stake_number,
        'datainfo.address': this.data.datainfo.address,
        weatherItems: this.data.weatherItems,
        carTypeItems: this.data.carTypeItems,
        eventTypeItems: this.data.eventTypeItems,
        driverStateItems: this.data.driverStateItems,
        carStateItems: this.data.carStateItems,
        trafficStateItems: this.data.trafficStateItems,
        colleagueItems: this.data.colleagueItems,
        weatherIndex: findIndex(this.data.weatherItems, this.data.datainfo.weather),
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.datainfo.car_type),
        eventTypeIndex: findIndex(this.data.eventTypeItems, this.data.datainfo.event_type),
        driverStateIndex: findIndex(this.data.driverStateItems, this.data.datainfo.driver_state),
        carStateIndex: findIndex(this.data.carStateItems, this.data.datainfo.car_state),
        trafficStateIndex: findIndex(this.data.trafficStateItems, this.data.datainfo.traffic_state),
        colleagueIndex: findIndex(this.data.colleagueItems, this.data.datainfo.colleague_id)
      }, () => {
        if (!this.data.datainfo.location) {
          // 定位
          this.mapPostion()
        }
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  mapPostion() {
    // 定位
    wx.showLoading({
      mask: true,
      title: '定位中...',
    })
    app.globalData.qqmapsdk.reverseGeocoder({
      success: (res) => {
        res = res.result
        this.data.datainfo.location = res.location.lng + ',' + res.location.lat
        this.data.datainfo.adcode = res.ad_info.adcode
        this.data.datainfo.district = res.ad_info.district
        this.data.datainfo.city = res.ad_info.city
        this.setData({
          'datainfo.address': res.formatted_addresses.recommend
        })
      },
      fail: (err) => {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '温馨提示',
                content: ' 获取定位失败，请前往设置打开定位权限',
                cancelText: '取消',
                confirmText: '设置',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting()
                  } else {
                    wx.navigateBack()
                  }
                }
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '请在系统设置中打开定位服务',
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) {
                  wx.navigateBack()
                }
              })
            }
          }
        })
      },
      complete: (res) => {
        wx.hideLoading()
      }
    })
  },

  cancelreport() {
    // 撤销案件
    wx.showModal({
      title: '',
      content: '是否确认撤销案件？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          api.cancelReport({
            report_id: this.data.report_id,
          }).then(res => {
            wx.navigateBack()
          }).catch(err => {})
        }
      }
    })
  },

  reportInfo() {
    // 信息提交
    if (this.data.submit) {
      return
    }
    this.setData({
      submit: true
    })
    this.data.datainfo.report_id = this.data.report_id
    api.reportInfo(this.data.datainfo).then(res => {
      this.data.datainfo.report_id = res.report_id
      wx.redirectTo({
        url: '/pages/law/reportfile/reportfile?report_id=' + res.report_id
      })
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  },

  eventTimeChange(e) {
    this.setData({
      'datainfo.event_time': e.detail.dateString
    })
  },

  weatherChange(e) {
    this.data.datainfo.weather = this.data.weatherItems[e.detail.value].id
    this.setData({
      weatherIndex: e.detail.value
    })
  },

  carTypeChange(e) {
    this.data.datainfo.car_type = this.data.carTypeItems[e.detail.value].id
    this.setData({
      carTypeIndex: e.detail.value
    })
  },

  stakeNumberInput(e) {
    this.data.datainfo.stake_number = e.detail.value
  },

  eventTypeChange(e) {
    this.data.datainfo.event_type = this.data.eventTypeItems[e.detail.value].id
    this.setData({
      eventTypeIndex: e.detail.value
    })
  },

  driverStateChange(e) {
    this.data.datainfo.driver_state = this.data.driverStateItems[e.detail.value].id
    this.setData({
      driverStateIndex: e.detail.value
    })
  },

  carStateChange(e) {
    this.data.datainfo.car_state = this.data.carStateItems[e.detail.value].id
    this.setData({
      carStateIndex: e.detail.value
    })
  },

  trafficStateChange(e) {
    this.data.datainfo.traffic_state = this.data.trafficStateItems[e.detail.value].id
    this.setData({
      trafficStateIndex: e.detail.value
    })
  },

  colleagueChange(e) {
    this.data.datainfo.colleague_id = this.data.colleagueItems[e.detail.value].id
    this.setData({
      colleagueIndex: e.detail.value
    })
  }

})