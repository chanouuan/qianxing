Page({

  data: {
    showcamera: false,
    showcanvas: false,
    loadcamera: false,
    flash: 'off',
    title: '',
    ocr_type: 0, // 1：身份证；3：行驶证；4：驾驶证；
    ctx: null
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('putData', data => {
      this.data.ctx = wx.createCameraContext()
      this.data.ocr_type = ~~data.ocr_type
      this.setData({
        title: data.title || ''
      })
    })
  },

  onUnload() {
    this.data.ctx = null
    this.setData({
      flash: 'off'
    })
  },

  onShow() {
    // 检查权限
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.camera']) {
          // 授权询问
          wx.authorize({
            scope: 'scope.camera',
            success: res => {
              this.setData({
                showcamera: true
              })
            },
            fail: err =>  {
              wx.showModal({
                title: '温馨提示',
                content: '如需正常使用此功能，请前往设置打开摄像头权限',
                cancelText: '取消',
                confirmText: '设置',
                success: res => {
                  if (res.confirm) {
                    wx.openSetting()
                  } else {
                    wx.navigateBack()
                  }
                }
              })
            }
          })
        } else {
          this.setData({
            showcamera: true
          })
        }
      }
    })
  },

  takelight() {
    // 开关灯
    this.setData({
      flash: this.data.flash == 'off' ? 'torch' : 'off'
    })
  },

  takephoto() {
    // 拍照
    if (!this.data.ctx) {
      return
    }
    wx.showLoading({
      mask: true,
      title: '正在处理'
    })
    this.data.ctx.takePhoto({
      // quality: 'high',
      success: (res) => {
        let tempImagePath = res.tempImagePath
        const query = wx.createSelectorQuery()
        query.select('#frame').boundingClientRect()
        query.exec((res) => {
          this.setData({
            showcanvas: true
          }, () => {
            this.drawcanvas(tempImagePath, res[0])
          })
        })
      },
      fail: (err) => {
        this.showmsg(err)
      }
    })
  },

  drawcanvas(filePath, rect) {
    // 画canvas
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        canvas.width = res[0].width
        canvas.height = res[0].height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 画图片
        let imgdata = canvas.createImage()
        imgdata.onload = (e) => {
          ctx.drawImage(imgdata, 0, 0, canvas.width, canvas.height)
          // 剪切图片
          wx.canvasToTempFilePath({
            canvas: canvas,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            destWidth: rect.width,
            destHeight: rect.height,
            fileType: 'jpg',
            quality: 1,
            success: (res) => {
              // 剪切成功 res.tempFilePath
              this.ocr(res.tempFilePath)
            },
            fail(err) {
              this.showmsg(err.errMsg)
            }
          })
        }
        imgdata.onerror = (e) => {
          console.error('拍照图片创建失败', e)
          this.showmsg(e)
        }
        imgdata.src = filePath
      })
  },

  takealbum() {
    // 相册
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        wx.showLoading({
          mask: true,
          title: '加载中...'
        })
        this.ocr(res.tempFilePaths[0])
      }
    })
  },

  back() {
    // 返回
    wx.navigateBack()
  },

  ocr(filePath) {
    // 图像识别
    if (!this.data.ocr_type) {
      // 不识别
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('cameraCallBack', {
        filePath: filePath,
        res: {}
      })
      wx.navigateBack()
      return
    }
    wx.showLoading({
      mask: true,
      title: '正在识别'
    })
    wx.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'base64',
      success: res => {
        // 微信OCR
        wx.serviceMarket.invokeService({
          service: 'wx79ac3de8be320b71',
          api: 'OcrAllInOne',
          data: {
            img_data: res.data,
            data_type: 2,
            ocr_type: this.data.ocr_type // 1：身份证；2：银行卡；3：行驶证；4：驾驶证；7：营业执照；8：通用OCR
          },
        }).then(res => {
          console.log('invokeService success', res)
          if (res.errMsg !== 'invokeService:ok') {
            return this.showmsg('未识别，请重试' + JSON.stringify(res))
          }
          let result = {
            filePath: filePath,
            res: {}
          }
          res = res.data || {}
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          // 身份证
          if (this.data.ocr_type == 1) {
            res = res.idcard_res
            if (res.type == 2 || !res.id) {
              return this.showmsg('未识别到身份证信息')
            }
            result.res = {
              type: res.type,
              name: res.name ? res.name.text : '', // 姓名
              idcard: res.id ? res.id.text : '', // 身份证号
              addr: res.address ? res.address.text : '', // 住址
              nationality: res.nationality ? res.nationality.text : '', // 民族
              valid_date: res.valid_date ? res.valid_date.text : '' // 有效期
            }
          }
          // 行驶证
          if (this.data.ocr_type == 3) {
            res = res.driving_res
            if (!res.plate_num) {
              return this.showmsg('未识别到行驶证信息')
            }
            result.res = {
              type: res.type,
              plate_num: res.plate_num ? res.plate_num.text : '', // 车牌号
              car_type: res.vehicle_type ? res.vehicle_type.text : '', // 车辆类型
              owner: res.owner ? res.owner.text : '', // 所有人
              addr: res.addr ? res.addr.text : '', // 住址
              vin: res.vin ? res.vin.text : '', // 车辆识别代号
              engine_num: res.engine_num ? res.engine_num.text : '', // 发动机号码
              register_date: res.register_date ? res.register_date.text : '', // 注册日期
              issue_date: res.issue_date ? res.issue_date.text : '', // 发证日期
              plate_num_b: res.plate_num_b ? res.plate_num_b.text : '' // 车牌号码
            }
          }
          // 驾驶证
          if (this.data.ocr_type == 4) {
            res = res.driving_license_res
            if (!res.name && !res.id_num) {
              return this.showmsg('未识别到驾驶证信息')
            }
            result.res = {
              type: res.type,
              idcard: res.id_num ? res.id_num.text : '', // 证号
              name: res.name ? res.name.text : '', // 姓名
              nationality: res.nationality ? res.nationality.text : '', // 国籍
              addr: res.address ? res.address.text : '', // 住址
              car_class: res.car_class ? res.car_class.text : '', // 准驾车型
              valid_from: res.valid_from ? res.valid_from.text : '', // 有效期限起始日
              valid_to: res.valid_to ? res.valid_to.text : '' // 有效期限终止日
            }
          }
          const eventChannel = this.getOpenerEventChannel()
          eventChannel.emit('cameraCallBack', result)
          wx.navigateBack()
        }).catch(err => {
          console.error('invokeService fail', err)
          this.showmsg('未能识别，请重试' + err.message)
        })
      },
      fail: err => {
        this.showmsg('文件读取失败' + err.errMsg)
      }
    })

  },

  showmsg(err) {
    // 显示错误
    wx.hideLoading({
      complete: () => {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: typeof err === 'object' ? JSON.stringify(err) : err,
          success: (res) => {
            if (res.confirm) {
              this.setData({
                showcamera: true,
                showcanvas: false
              })
            }
          }
        })
      },
    })
    return false
  },

  onstop(e) {
    // 摄像头在非正常终止时触发，如退出后台等情况
    this.setData({
      showcamera: false,
      showcanvas: false
    })
  },

  onerror(e) {
    // 用户不允许使用摄像头时触发
    wx.navigateBack()
  },

  oninitdone(e) {
    // 相机初始化完成时触发
    if (this.data.showcamera) {
      this.setData({
        loadcamera: true
      })
    }
  }

})