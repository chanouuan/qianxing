const api = require('../../../api/api.js')

Page({

  data: {
    tabIndex: 0,
    report_id: 0,
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
    driving_license_behind_progress: 0
  },

  onLoad(options) {
    this.data.report_id = options.report_id
    // 获取案件信息
    wx.showLoading({
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'info'
    }).then(res => {
      wx.hideLoading()
      let data = {
        idcard_front: res.idcard_front,
        idcard_behind: res.idcard_behind,
        driver_license_front: res.driver_license_front,
        driver_license_behind: res.driver_license_behind,
        driving_license_front: res.driving_license_front,
        driving_license_behind: res.driving_license_behind,
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
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  cardinfo() {
    // 下一步
    wx.navigateTo({
      url: '/pages/law/cardinfo/cardinfo?report_id=' + this.data.report_id
    })
  }

})