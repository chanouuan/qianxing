// pages/law/reportinfo/reportinfo.js
const api = require('../../../api/api.js')
const util = require('../../../utils/util.js')
const app = getApp()

const findIndex = (arr, id, init) => {
  for (let i = 0, j = arr.length; i < j; i++) {
    if (arr[i].id == id) {
      return i
    }
  }
  return init ? init : 0
}

const getPassTime = () => {
  let arr = [{ id: 0, name: '请选择' }]
  for (let i = 10; i <= 180; i += 10) {
    arr.push({ id: i, name: i + '分钟' })
  }
  return arr
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
    passTimeItems: getPassTime(),
    passTimeIndex: 0,
    colleagueItems: [{ id: 0, name: '请选择' }],
    colleagueIndex: 0,
    wayline: [], // 桩号路段
    waylineIndex: 0,
    wayk: '',
    waym: '',
    waydirection: ['上行', '下行', '双向'], // 行车方向
    waydirectionIndex: 0,
    is_law: 1, // 是否受理人操作，协同人员也可以进入操作
    datainfo: {
      event_time: null,
      weather: 0,
      car_type: 0,
      address: '',
      event_type: 0,
      driver_state: 0,
      car_state: 0,
      traffic_state: 0,
      pass_time: 0,
      colleague_id: 0,
      check_start_time: 0,
      is_property: 1,
      is_load: 0,
      total_money: 0
    }
  },

  onLoad: function(options) {
    this.setData({
      report_id: options.report_id // 案件ID
    })
    // 获取案件信息
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'info'
    }).then(res => {
      this.data.datainfo = {
        location: res.location,
        event_time: res.event_time || util.formatTime(new Date()),
        address: res.address || '',
        weather: res.weather,
        car_type: res.car_type,
        event_type: res.event_type,
        driver_state: res.driver_state,
        car_state: res.car_state,
        traffic_state: res.traffic_state,
        pass_time: res.pass_time,
        colleague_id: res.colleague_id,
        check_start_time: res.check_start_time || util.formatTime(new Date()),
        is_property: res.is_property,
        is_load: res.is_load || 0,
        total_money: res.total_money || 0
      }
      this.data.weatherItems = this.data.weatherItems.concat(res.weather_list)
      this.data.carTypeItems = this.data.carTypeItems.concat(res.car_type_list)
      this.data.eventTypeItems = this.data.eventTypeItems.concat(res.event_type_list)
      this.data.driverStateItems = this.data.driverStateItems.concat(res.driver_state_list)
      this.data.carStateItems = this.data.carStateItems.concat(res.car_state_list)
      this.data.trafficStateItems = this.data.trafficStateItems.concat(res.traffic_state_list)
      this.data.colleagueItems = this.data.colleagueItems.concat(res.colleague_list)
      // 桩号 G75兰海高速K1247+500M下行
      res.way_line = res.way_line || ''
      res.way_line = res.way_line.split(',')
      res.stake_number = res.stake_number || ''
      res.stake_number = res.stake_number.split(' ')
      this.data.waylineIndex = res.way_line.indexOf(res.stake_number[0])
      this.data.waylineIndex = this.data.waylineIndex === -1 ? 0 : this.data.waylineIndex
      this.data.waydirectionIndex = this.data.waydirection.indexOf(res.stake_number[6])
      this.data.waydirectionIndex = this.data.waydirectionIndex === -1 ? 0 : this.data.waydirectionIndex
      this.setData({
        is_law: this.data.datainfo.colleague_id !== app.globalData.userInfo.id,
        wayline: res.way_line,
        waylineIndex: this.data.waylineIndex,
        wayk: res.stake_number[2] ? res.stake_number[2] : '',
        waym: res.stake_number[4] ? res.stake_number[4] : '',
        waydirectionIndex: this.data.waydirectionIndex,
        'datainfo.event_time': this.data.datainfo.event_time,
        'datainfo.address': this.data.datainfo.address,
        'datainfo.check_start_time': this.data.datainfo.check_start_time,
        'datainfo.is_property': this.data.datainfo.is_property,
        'datainfo.is_load': this.data.datainfo.is_load,
        'datainfo.total_money': this.data.datainfo.total_money,
        weatherItems: this.data.weatherItems,
        carTypeItems: this.data.carTypeItems,
        eventTypeItems: this.data.eventTypeItems,
        driverStateItems: this.data.driverStateItems,
        carStateItems: this.data.carStateItems,
        trafficStateItems: this.data.trafficStateItems,
        colleagueItems: this.data.colleagueItems,
        weatherIndex: findIndex(this.data.weatherItems, this.data.datainfo.weather, 1),
        carTypeIndex: findIndex(this.data.carTypeItems, this.data.datainfo.car_type, 1),
        eventTypeIndex: findIndex(this.data.eventTypeItems, this.data.datainfo.event_type, 1),
        driverStateIndex: findIndex(this.data.driverStateItems, this.data.datainfo.driver_state, 1),
        carStateIndex: findIndex(this.data.carStateItems, this.data.datainfo.car_state, 1),
        trafficStateIndex: findIndex(this.data.trafficStateItems, this.data.datainfo.traffic_state, 2),
        passTimeIndex: findIndex(this.data.passTimeItems, this.data.datainfo.pass_time, 3),
        colleagueIndex: findIndex(this.data.colleagueItems, this.data.datainfo.colleague_id)
      }, () => {
        wx.hideLoading()
        this.data.datainfo.weather = this.data.weatherItems[this.data.weatherIndex].id
        this.data.datainfo.car_type = this.data.carTypeItems[this.data.carTypeIndex].id
        this.data.datainfo.event_type = this.data.eventTypeItems[this.data.eventTypeIndex].id
        this.data.datainfo.driver_state = this.data.driverStateItems[this.data.driverStateIndex].id
        this.data.datainfo.car_state = this.data.carStateItems[this.data.carStateIndex].id
        this.data.datainfo.traffic_state = this.data.trafficStateItems[this.data.trafficStateIndex].id
        this.data.datainfo.pass_time = this.data.passTimeItems[this.data.passTimeIndex].id
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
    // 确认信息提交
    if (this.data.datainfo.is_property) {
      this.submitReportInfo()
    } else {
      // 无路产损失
      wx.showModal({
        title: '',
        content: '当前案件无路产损失，将不进行现场勘验，是否确认提交？',
        confirmText: '确认',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.submitReportInfo()
          }
        }
      })
    }
  },

  submitReportInfo() {
    // 信息提交
    if (this.data.submit) {
      return
    }
    this.setData({
      submit: true
    })
    // 组合桩号
    let stake_number = [
      this.data.wayline[this.data.waylineIndex] ? this.data.wayline[this.data.waylineIndex] : '',
      'K',
      this.data.wayk === '' ? 0 : this.data.wayk,
      '+',
      this.data.waym === '' ? 0 : this.data.waym,
      'M',
      this.data.waydirection[this.data.waydirectionIndex] ? this.data.waydirection[this.data.waydirectionIndex] : '',
    ]
    this.data.datainfo.stake_number = stake_number.join(' ')
    this.data.datainfo.report_id = this.data.report_id
    api.reportInfo(this.data.datainfo).then(res => {
      if (!res.report_id) {
        // 未有路产损失的情况
        wx.navigateBack()
      } else {
        this.data.datainfo.report_id = res.report_id
        wx.redirectTo({
          url: '/pages/law/reportfile/reportfile?report_id=' + res.report_id
        })
      }
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  },

  isPropertyChange(e) {
    this.data.datainfo.is_property = ~~e.detail.value
  },

  eventTimeChange(e) {
    this.setData({
      'datainfo.event_time': e.detail.dateString
    })
  },

  checkTimeChange(e) {
    this.setData({
      'datainfo.check_start_time': e.detail.dateString
    })
  },

  waylineChange(e) {
    this.setData({
      waylineIndex: e.detail.value
    })
  },

  waydirectionChange(e) {
    this.setData({
      waydirectionIndex: e.detail.value
    })
  },

  waykInput(e) {
    this.data.wayk = e.detail.value
  },

  waymInput(e) {
    this.data.waym = e.detail.value
  },

  passTimeChange(e) {
    this.data.datainfo.pass_time = this.data.passTimeItems[e.detail.value].id
    this.setData({
      passTimeIndex: e.detail.value
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