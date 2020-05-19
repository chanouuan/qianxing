const api = require('../../../api/api.js')

Page({

  data: {
    tabIndex: 0,
    inputFlag: false,
    input_site_photo_name: '',
    input_parameter: {},
    submit: false,
    report_id: 0,
    // 现场图照参数
    site_photos: [{
        src: ''
      },
      {
        src: ''
      },
      {
        src: ''
      },
      {
        src: ''
      },
      {
        src: ''
      }
    ],
    // 多当事人参数
    person_index: 0,
    persons: [],
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
      mask: true,
      title: '加载中...'
    })
    api.getReportDetail({
      report_id: this.data.report_id,
      data_type: 'all'
    }).then(res => {
      let data = {
        persons: res.persons || [],
        involved_action: res.involved_action || {},
        involved_act: res.involved_act,
        extra_info: res.extra_info || '',
        involved_build_project: res.involved_build_project || '',
        involved_action_type: res.involved_action_type || {},
        items: res.items,
        totalMoney: res.total_money
      }
      if (res.site_photos && res.site_photos.length) {
        data.site_photos = res.site_photos
      }
      this.setData(data, () => {
        wx.hideLoading()
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  nodata() {},

  selectPersonPhoto(e) {
    // 选择当事人证件照
    let index = e.currentTarget.dataset.index
    this.setData({
      person_index: index
    })
  },

  delPersonPhoto(e) {
    // 删除当事人证件照
    let index = ~~e.currentTarget.dataset.index
    wx.showModal({
      title: '',
      content: '是否删除“' + (this.data.persons[index].full_name || '当事人') + '”？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '提交中...'
          })
          api.saveReportPerson({
            report_id: this.data.report_id,
            person_id: this.data.persons[index].id
          }).then(res => {
            this.data.persons.splice(index, 1)
            this.setData({
              persons: this.data.persons
            }, () => {
              wx.hideLoading()
            })
          }).catch(err => {})
        }
      }
    })
  },

  addPersonPhoto() {
    // 添加当事人证件照
    wx.showLoading({
      title: '提交中...'
    })
    api.saveReportPerson({
      report_id: this.data.report_id
    }).then(res => {
      this.data.persons.push({
        id: res.person_id,
        full_name: '',
        idcard_front: '',
        idcard_behind: '',
        driver_license_front: '',
        driver_license_behind: '',
        driving_license_front: '',
        driving_license_behind: ''
      })
      this.setData({
        persons: this.data.persons
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {})
  },

  changeinput(e) {
    // input
    this.data[e.currentTarget.dataset.name] = e.detail.value
  },

  involvedActionChange(e) {
    // 补偿行为
    let value = e.detail.value
    this.data.involved_action = {}
    value.forEach(n => {
      // a b 二选一
      if (n === 'a') {
        this.data.involved_action.b = false
      }
      if (n === 'b') {
        this.data.involved_action.a = false
      }
      this.data.involved_action[n] = true
    })
    this.setData({
      ['involved_action.a']: !!this.data.involved_action.a,
      ['involved_action.b']: !!this.data.involved_action.b
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

  nameInput(e) {
    // 项目名称
    let value = e.detail.value
    let index = e.currentTarget.dataset.index
    this.setData({
      ['items[' + index + '].name']: value
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
    let value = parseFloat(e.detail.value)
    let index = e.currentTarget.dataset.index
    if (isNaN(value) || e.detail.value.substr(-1) === '.') {
      this.data.items[index].amount = 0
    } else {
      value = parseFloat(value.toFixed(1))
      this.setData({
        ['items[' + index + '].amount']: value
      })
    }
    this.totalMoney()
  },

  removeitem(e) {
    // 删除路产项
    let index = ~~e.currentTarget.dataset.index
    wx.showModal({
      title: '',
      content: '是否删除“' + this.data.items[index].name + '”？',
      success: (res) => {
        if (res.confirm) {
          this.data.items.splice(index, 1)
          this.setData({
            items: this.data.items
          }, () => {
            this.totalMoney()
          })
        }
      }
    })
  },

  propertylist() {
    // 查看产路赔损项目列表
    wx.navigateTo({
      url: '/pages/law/propertylist/propertylist'
    })
  },

  searchInput(e) {
    // 搜索收费项目
    let name = e.detail.value
    clearTimeout(this.data.clearTime)
    if (!name) return
    this.data.clearTime = setTimeout(() => {
      wx.showNavigationBarLoading()
      api.searchPropertyItems({
        name
      }).then(result => {
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

  addSitePhoto() {
    // 增加现场图照
    if (this.data.site_photos.length > 5 && !this.data.site_photos[this.data.site_photos.length - 1].src) {
      wx.showToast({
        icon: 'none',
        title: '请先拍照上传前一张图照'
      })
      return
    }
    if (this.data.site_photos.length >= 11) {
      wx.showToast({
        icon: 'none',
        title: '不能上传更多现场图照了'
      })
      return
    }
    this.data.site_photos.push({
      src: '',
      name: ''
    })
    this.setData({
      site_photos: this.data.site_photos
    })
  },

  closeInputModal(e) {
    // 关闭现场图照名称填写弹框
    this.setData({
      inputFlag: false
    })
  },

  inputOk(e) {
    // 现场图照名称填写回调
    let index = e.detail.index
    let value = e.detail.value
    this.setData({
      inputFlag: false
    })
    wx.showLoading({
      title: '提交中...'
    })
    api.saveSitePhoto({
      report_id: this.data.report_id,
      index: index,
      name: value
    }).then(res => {
      this.setData({
        ['site_photos[' + index + '].name']: value
      }, () => {
        wx.hideLoading()
      })
    }).catch(err => {})
  },

  changePhotoName(e) {
    // 修改现场图照名称
    let index = ~~e.currentTarget.dataset.index
    if (!this.data.site_photos[index].src) {
      wx.showToast({
        icon: 'none',
        title: '请先拍照上传'
      })
      return
    }
    let name = this.data.site_photos[index].name
    name = name ? name : (index === 0 ? '前面' : (index === 1 ? '侧面' : (index === 2 ? '后面' : (index === 3 ? '前全景' : (index === 4 ? '后全景' : '')))))
    this.setData({
      inputFlag: true,
      input_site_photo_name: name,
      input_parameter: {
        index: index
      }
    })
  },

  delSitePhoto(e) {
    // 删除现场图照
    let index = ~~e.currentTarget.dataset.index
    wx.showModal({
      title: '',
      content: '是否删除“' + (this.data.site_photos[index].name || '现场图照') + '”？',
      success: (res) => {
        if (res.confirm) {
          if (!this.data.site_photos[index].src) {
            this.data.site_photos.splice(index, 1)
            this.setData({
              site_photos: this.data.site_photos
            })
          } else {
            wx.showLoading({
              title: '提交中...'
            })
            api.saveSitePhoto({
              report_id: this.data.report_id,
              remove: 1,
              index: index
            }).then(res => {
              this.data.site_photos.splice(index, 1)
              this.setData({
                site_photos: this.data.site_photos
              }, () => {
                wx.hideLoading()
              })
            }).catch(err => {})
          }
        }
      }
    })
  },

  takeSitePhotos(e) {
    // 现场拍照
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 上传图片
        wx.showLoading({
          mask: true,
          title: '图片上传中...'
        })
        api.uploadPhoto({
          filePath: res.tempFilePaths[0],
          body: {
            report_id: this.data.report_id,
            report_field: 'site_photos',
            report_field_index: index
          }
        }).then(res => {
          // 上传成功
          this.setData({
            ['site_photos[' + index + '].src']: res.url
          }, () => {
            wx.hideLoading()
          })
        }).catch(err => {
          console.error('现场图照上传失败', err)
        })
      }
    })
  },

  cutPhoto(e) {
    // ocr识别
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/law/camera/camera',
      events: {
        cameraCallBack: res => {
          // 上传图片
          wx.showLoading({
            mask: true,
            title: '图片上传中...'
          })
          api.uploadPhoto({
            filePath: res.filePath,
            body: Object.assign({
              report_id: this.data.report_id,
              report_field: name,
              report_field_index: this.data.persons[this.data.person_index].id
            }, res.res)
          }).then(res => {
            // 上传成功
            this.setData({
              ['persons[' + this.data.person_index + '].' + name]: res.url
            }, () => {
              wx.hideLoading()
            })
          }).catch(err => {
            console.error('证件图照上传失败', err)
          })
        }
      },
      success: res => {
        res.eventChannel.emit('putData', e.currentTarget.dataset)
      }
    })
  },

  onClickTab(e) {
    this.setData({
      tabIndex: e.detail.current
    })
  },

  goTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
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
        name: n.name,
        unit: n.unit,
        amount: n.amount,
        price: n.price
      })
    })
    api.reportItem({
      report_id: this.data.report_id,
      items: items,
      involved_action: this.data.involved_action,
      involved_build_project: this.data.involved_build_project,
      involved_act: this.data.involved_act,
      involved_action_type: this.data.involved_action_type,
      extra_info: this.data.extra_info
    }).then(res => {
      wx.navigateTo({
        url: '/pages/law/paper/paper?report_id=' + this.data.report_id,
        success: () => {
          this.setData({
            submit: false
          })
        }
      })
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  },

  reportadmin() {
    // 通知后勤审核
    wx.navigateBack()
  },

  reportfile() {
    // 下发赔偿通知书
    if (this.data.submit) {
      return
    }
    wx.showModal({
      title: '',
      content: '是否确认发送赔偿通知书给当事人？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            submit: true
          })
          api.reportFile({
            report_id: this.data.report_id,
          }).then(res => {
            wx.navigateBack()
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