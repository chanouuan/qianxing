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
    weatherItems: [{ id: 0, name: '请选择' }, { id: 1, name: '晴' }, { id: 2, name: '阴' }, { id: 3, name: '雨' }, { id: 4, name: '雪' }, { id: 5, name: '雾'}],
    weatherIndex: 0,
    carTypeItems: [{ id: 0, name: '请选择' }, { id: 1, name: '小型车' }, { id: 2, name: '中型车' }, { id: 3, name: '大型车'}],
    carTypeIndex: 0,
    eventTypeItems: [{ id: 0, name: '请选择' }, { id: 1, name: '公路突发事件' }, { id: 2, name: '自然灾害' }, { id: 3, name: '交通建设工程安全事故' }, { id: 4, name: '社会安全事件'}], // 事件类型
    eventTypeIndex: 0,
    driverStateItems: [{ id: 0, name: '请选择' }, { id: 1, name: '待核实'}], // 受伤情况
    driverStateIndex: 0,
    carStateItems: [{ id: 0, name: '请选择' }, { id: 1, name: '待核实'}], // 车辆情况
    carStateIndex: 0,
    trafficStateItems: [{ id: 0, name: '请选择' }, { id: 1, name: '待核实'}], // 交通情况
    trafficStateIndex: 0,
    colleagueItems: [{ id: 0, name: '请选择' }],
    colleagueIndex: 0,
    datainfo: {
      event_time: util.formatTime(new Date()),
      weather: 0,
      car_type: 0,
      stake_number: '',
      event_type: 0,
      driver_state: 0,
      car_state: 0,
      traffic_state: 0,
      colleague_id: 0
    }
  },

  onLoad: function(options) {
    this.data.report_id = options.report_id // 案件ID
    // 获取案件信息
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'info'
    }).then(res => {
      wx.hideLoading()
      this.data.datainfo = Object.assign(this.data.datainfo, res)
      this.setData({
        'datainfo.event_time': this.data.datainfo.event_time,
        'datainfo.stake_number': this.data.datainfo.stake_number,
        'datainfo.address': this.data.datainfo.address,
        weatherIndex: findIndex(this.data.weatherItems, this.data.datainfo.weather),
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.datainfo.car_type),
        eventTypeIndex: findIndex(this.data.eventTypeItems, this.data.datainfo.event_type),
        driverStateIndex: findIndex(this.data.driverStateItems, this.data.datainfo.driver_state),
        carStateIndex: findIndex(this.data.carStateItems, this.data.datainfo.car_state),
        trafficStateIndex: findIndex(this.data.trafficStateItems, this.data.datainfo.traffic_state)
      }, () => {
        if (!this.data.datainfo.location) {
          // 定位
          this.mapPostion()
        }
      })
      // 获取同事
      api.getColleague().then(res => {
        this.data.colleagueItems = this.data.colleagueItems.concat(res)
        this.setData({
          colleagueItems: this.data.colleagueItems,
          colleagueIndex: findIndex(this.data.colleagueItems, this.data.datainfo.colleague_id)
        })
      }).catch(err => {})
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
        wx.showToast({
          title: '获取地理位置失败' + err,
          icon: 'none'
        })
      },
      complete: (res) => {
        wx.hideLoading()
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