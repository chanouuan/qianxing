const api = require('../../../api/api.js')
const app = getApp()

Page({

  data: {
    pageFlag: false,
    authModalFlag: false,
    userInfo: {},
    report_type: 1,
    address: '',
    addr_des: '',
    latitude: 0, // 27.48074
    longitude: 0, // 106.375
    form: {},
    groupIndex: 0,
    groupList: [{id: 0, name: '区域内无执法单位'}],
    submit: false
  },

  onLoad: function (options) {
    this.data.userInfo = app.globalData.userInfo
    if (this.data.userInfo.telephone) {
      this.mapPostion().then(() => {
        this.setData({
          pageFlag: true
        }, () => {
          this.getDistrictGroup()
        })
      }).catch(err => {})
    } else {
      this.setData({
        pageFlag: false,
        authModalFlag: true
      })
    }
  },

  getDistrictGroup() {
    // 获取区域执法单位
    api.getDistrictGroup(this.data.form).then(res => {
      this.setData({
        groupIndex: 0,
        groupList: res && res.length ? res : [{ id: 0, name: '区域内无执法单位' }]
      })
    }).catch(err => {
      this.setData({
        groupIndex: 0,
        groupList: [{ id: 0, name: '区域内无执法单位' }]
      })
    })
  },

  mapPostion () {
    // 定位
    wx.showNavigationBarLoading()
    return new Promise((resolve, reject) => {
      app.globalData.qqmapsdk.reverseGeocoder({
        success: (res) => {
          res = res.result
          this.data.form = {
            location: res.location.lng + ',' + res.location.lat,
            address: res.formatted_addresses.recommend,
            adcode: res.ad_info.adcode,
            district: res.ad_info.district,
            city: res.ad_info.city
          }
          this.setData({
            latitude: res.location.lat,
            longitude: res.location.lng,
            address: res.formatted_addresses.recommend,
            addr_des: res.address
          }, () => {
            resolve()
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
          reject(err)
        },
        complete: (res) => {
          wx.hideNavigationBarLoading()
        }
      })
    })
  },

  handleCloseModal () {
    // 关闭授权弹窗
    this.setData({
      authModalFlag: false
    }, () => {
      wx.navigateBack()
    })
  },

  handleBindOk () {
    // 绑定授权成功
    this.mapPostion().then(() => {
      this.setData({
        pageFlag: true,
        authModalFlag: false,
        userInfo: app.globalData.userInfo
      }, () => {
        this.getDistrictGroup()
      })
    }).catch(err => {})
  },

  getCenterLocation(e) {
    // 获取中心位置坐标
    if (!(e.type == 'end' && e.causedBy == 'drag')) {
      return
    }
    // 中心点坐标
    const mapCtx = wx.createMapContext('map', this)
    wx.showNavigationBarLoading()
    mapCtx.getCenterLocation({
      success: res => {
        app.globalData.qqmapsdk.reverseGeocoder({
          location: res.latitude + ',' + res.longitude,
          success: (res) => {
            res = res.result
            this.data.form = {
              location: res.location.lng + ',' + res.location.lat,
              address: res.formatted_addresses.recommend,
              adcode: res.ad_info.adcode,
              district: res.ad_info.district,
              city: res.ad_info.city
            }
            this.setData({
              address: res.formatted_addresses.recommend,
              addr_des: res.address,
              animation: true
            }, () => {
              this.getDistrictGroup()
            })
          },
          fail: (err) => {
            wx.showToast({
              title: '获取地理位置失败' + err,
              icon: 'none'
            })
          },
          complete: (res) => {
           wx.hideNavigationBarLoading()
          }
        })
      }
    })
  },

  onMarkerAnimationend () {
    // 地图控件动画结束
    this.setData({
      animation: false
    })
  },

  customeCall () {
    // 拨打客服电话
    wx.makePhoneCall({
      phoneNumber: '12328'
    })
  },

  getNowLocation () {
    // 重置定位
    this.mapPostion().then(res => {
      this.getDistrictGroup()
    }).catch(err => {})
  },

  groupChange(e) {
    // 单位选择
    this.setData({
      groupIndex: e.detail.value
    })
  },

  changeReportType(e) {
    // 报警类型选择
    this.setData({
      report_type: e.currentTarget.dataset.type
    })
  },

  report () {
    // 提交报案
    if (this.data.submit) {
      return
    }
    if (!this.data.groupList[this.data.groupIndex] || !this.data.groupList[this.data.groupIndex].id) {
      wx.showToast({
        icon: 'none',
        duration: 3000,
        title: '区域内无执法单位，建议拨打12328'
      })
      return
    }
    wx.showModal({
      title: '',
      content: '你确定报案吗？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            submit: true
          })
          this.data.form.report_type = this.data.report_type
          this.data.form.group_id = this.data.groupList[this.data.groupIndex].id
          api.reportEvent(this.data.form).then(res => {
            wx.redirectTo({
              url: '/pages/user/tips/tips?phone=' + res.phone
            })
          }).catch(err => {
            this.setData({
              submit: false
            })
          })
        }
      }
    })
  }
})