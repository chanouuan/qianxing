const api = require('../../../api/api.js')

Page({

  data: {
    tabIndex: 0,
    submit: false,
    report_id: 0,
    // 照相参数
    site_photos: [{
        src: null,
        progress: 0
      },
      {
        src: null,
        progress: 0
      },
      {
        src: null,
        progress: 0
      },
      {
        src: null,
        progress: 0
      },
      {
        src: null,
        progress: 0
      }
    ],
    idcard_front: null,
    idcard_front_progress: 0,
    idcard_behind: null,
    idcard_behind_progress: 0,
    driver_license_front: null,
    driver_license_front_progress: 0,
    driver_license_behind: null,
    driver_license_behind_progress: 0,
    driving_license_front: null,
    driving_license_front_progress: 0,
    driving_license_behind: null,
    driving_license_behind_progress: 0,
    // 赔偿清单参数
    items: [],
    searchItemName: '',
    clearTime: null,
    totalMoney: 0,
    // 补偿行为参数
    involved_action: {},
    involved_build_project: '',
    involved_act: '',
    involved_action_type: {},
    extra_info: ''
  },

  onLoad(options) {
    this.data.report_id = options.report_id
    // 获取案件信息
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'all'
    }).then(res => {
      wx.hideLoading()
      let data = {
        idcard_front: res.idcard_front,
        idcard_behind: res.idcard_behind,
        driver_license_front: res.driver_license_front,
        driver_license_behind: res.driver_license_behind,
        driving_license_front: res.driving_license_front,
        driving_license_behind: res.driving_license_behind,
        involved_action: res.involved_action,
        involved_act: res.involved_act,
        extra_info: res.extra_info,
        involved_build_project: res.involved_build_project,
        involved_action_type: res.involved_action_type,
        items: res.items,
        totalMoney: res.pay
      }
      if (res.site_photos && res.site_photos.length) {
        data.site_photos = res.site_photos.map(n => {
          return { src: n.src, progress: 0 }
        })
      }
      this.setData(data)
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  nodata() {},

  changeinput(e) {
    // input
    this.data[e.currentTarget.dataset.name] = e.detail.value
  },

  involvedActionChange(e) {
    // 补偿行为
    let value = e.detail.value
    this.data.involved_action = {}
    value.forEach(n => {
      this.data.involved_action[n] = true
    })
  },

  involvedActionTypeChange(e) {
    // 涉案行为类别
    let value = e.detail.value
    this.data.involved_action_type = {}
    value.forEach(n => {
      this.data.involved_action_type[n] = true
    })
  },

  totalMoney() {
    // 赔付合计
    let total = 0
    this.data.items.forEach(n => {
      total += n.price * n.amount
    })
    this.setData({
      totalMoney: total.toFixed(2)
    })
  },

  priceInput(e) {
    // 收费
    let value = parseFloat(e.detail.value)
    let index = e.currentTarget.dataset.index
    if (isNaN(value) || e.detail.value.substr(-1) === '.') {
      this.data.items[index].price = 0
    } else {
      value = parseFloat(value.toFixed(2))
      this.setData({
        ['items[' + index + '].price']: value
      })
    }
    this.totalMoney()
  },

  amountInput(e) {
    // 数量
    let value = parseInt(e.detail.value)
    let index = e.currentTarget.dataset.index
    if (isNaN(value)) {
      this.data.items[index].amount = 0
    } else {
      this.setData({
        ['items[' + index + '].amount']: value
      })
    }
    this.totalMoney()
  },

  searchInput(e) {
    // 搜索收费项目
    let name = e.detail.value
    clearTimeout(this.data.clearTime)
    if (!name) return
    this.data.clearTime = setTimeout(() => {
      wx.showNavigationBarLoading()
      api.searchPropertyItems({ name }).then(result => {
        wx.hideNavigationBarLoading()
        if (result && result.length) {
          wx.showActionSheet({
            itemList: result.map(n => n.name + '(' + '￥' + n.price + '/' + n.unit + ')'),
            success: (res) => {
              let post = result[res.tapIndex]
              post.amount = 1
              post.total_money = post.price
              this.data.items.push(post)
              this.setData({
                items: this.data.items,
                searchItemName: ''
              })
              this.totalMoney()
            }
          })
        }
      }).catch(err => {
        wx.hideNavigationBarLoading()
      })
    }, 300)
  },

  takeSitePhotos(e) {
    // 拍照
    let index = e.currentTarget.dataset.index
    if (this.data.site_photos[index].progress) {
      wx.showToast({
        icon: 'none',
        title: '正在上传图片...'
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          ['site_photos[' + index + '].src']: res.tempFilePaths[0]
        }, () => {
          // 上传图片
          let options = {
            filePath: res.tempFilePaths[0],
            body: {
              report_id: this.data.report_id,
              report_field: 'site_photos',
              report_field_index: index
            },
            progress: (res) => {
              this.setData({
                ['site_photos[' + index + '].progress']: res.progress === 100 ? 0 : res.progress
              })
            }
          }
          api.uploadPhoto(options).then(res => {
            // 上传成功
          }).catch(err => {
            this.data.site_photos[index].progress = 0
          })
        })
      }
    })
  },

  takePhoto(e) {
    // 拍照
    let name = e.currentTarget.dataset.name
    if (this.data[name + '_progress']) {
      wx.showToast({
        icon: 'none',
        title: '正在上传图片...'
      })
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          [name]: res.tempFilePaths[0]
        }, () => {
          // 上传图片
          let options = {
            filePath: res.tempFilePaths[0],
            body: {
              report_id: this.data.report_id,
              report_field: name
            },
            progress: (res) => {
              this.setData({
                [name + '_progress']: res.progress === 100 ? 0 : res.progress
              })
            }
          }
          api.uploadPhoto(options).then(res => {
            // 上传成功
          }).catch(err => {
            this.data[name + '_progress'] = 0
          })
        })
      }
    })
  },

  driversuccess(e) {
    // 行驶证识别
    if (this.data.driving_license_front_progress) {
      wx.showToast({
        icon: 'none',
        title: '正在上传图片...'
      })
      return
    }
    this.setData({
      driving_license_front: e.detail.image_path
    }, () => {
      // 上传图片
      let options = {
        filePath: e.detail.image_path,
        body: {
          report_id: this.data.report_id,
          report_field: 'driving_license_front',
          plate_num: e.detail.plate_num.text
        },
        progress: (res) => {
          this.setData({
            driving_license_front_progress: res.progress === 100 ? 0 : res.progress
          })
        }
      }
      api.uploadPhoto(options).then(res => {
        // 上传成功
      }).catch(err => {
        this.data.driving_license_front_progress = 0
      })
    })
  },

  idcardsuccess(e) {
    // 身份证识别
    if (this.data.idcard_front_progress) {
      wx.showToast({
        icon: 'none',
        title: '正在上传图片...'
      })
      return
    }
    this.setData({
      idcard_front: e.detail.image_path
    }, () => {
      // 上传图片
      let options = {
        filePath: e.detail.image_path,
        body: {
          report_id: this.data.report_id,
          report_field: 'idcard_front',
          name: e.detail.name.text,
          nationality: e.detail.nationality.text,
          addr: e.detail.address.text,
          idcard: e.detail.id.text
        },
        progress: (res) => {
          this.setData({
            idcard_front_progress: res.progress === 100 ? 0 : res.progress
          })
        }
      }
      api.uploadPhoto(options).then(res => {
        // 上传成功
      }).catch(err => {
        this.data.idcard_front_progress = 0
      })
    })
  },

  onClickTab(e) {
    this.setData({
      tabIndex: e.detail.current
    })
  },

  cardinfo() {
    // 证件采集下一步
    wx.navigateTo({
      url: '/pages/law/cardinfo/cardinfo?report_id=' + this.data.report_id
    })
  },

  reportitem() {
    // 勘验笔录下一步
    if (this.data.submit) {
      return
    }
    this.setData({
      submit: true
    })
    let items = []
    this.data.items.forEach(n => {
      items.push({
        property_id: n.property_id,
        amount: n.amount,
        price: n.price
      })
    })
    api.reportItem({
      report_id: this.data.report_id,
      items: JSON.stringify(items),
      involved_action: JSON.stringify(this.data.involved_action),
      involved_build_project: this.data.involved_build_project,
      involved_act: this.data.involved_act,
      involved_action_type: JSON.stringify(this.data.involved_action_type),
      extra_info: this.data.extra_info
    }).then(res => {
      this.setData({
        submit: false,
        tabIndex: 2
      })
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  }

})