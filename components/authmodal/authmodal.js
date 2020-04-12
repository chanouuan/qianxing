// components/authmodal/authmodal.js

const api = require('../../api/api.js')
const app = getApp()

Component({

  data: {
    authFlag: true,
    authSecondFlag: false,
    authLastFlag: false,
    count: 60,
    codeLength: 6,
    mobile: '',
    isFocus: false,
    code: [],
    timer: null
  },

  lifetimes: {
    detached() {
      this.resetCountDown()
    }
  },

  methods: {

    handleWxAuth(e) {
      // 点击微信授权
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      if (!encryptedData || !iv) {
        return
      }
      wx.login({
        success: res => {
          api.changePhone({
            code: res.code,
            encryptedData: encryptedData,
            iv: iv
          }).then(res => {
            wx.showToast({
              title: '授权成功',
              icon: 'none'
            })
            app.globalData.userInfo = Object.assign(app.globalData.userInfo, res)
            this.triggerEvent('bindok')
          })
        }
      })
    },

    handleTelAuth() {
      // 点击短信验证
      this.setData({
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },

    handleEnterTel(e) {
      // 输入手机号
      this.setData({
        mobile: e.detail.value
      })
    },

    handleGetCode() {
      // 获取验证码
      let mobile = this.data.mobile
      if (!/^1[0-9]{10}$/.test(mobile)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      api.sendSms(mobile)
        .then(res => {
          this.setData({
            code: [],
            authFlag: false,
            authSecondFlag: false,
            authLastFlag: true,
          }, () => {
            wx.showToast({
              title: '验证码已发送',
              icon: 'none'
            })
            this.countDown()
          })
        }).catch(err => {})
    },

    inputCode(e) {
      // 验证码输入验证
      let vercode = e.detail.value.split('')
      this.setData({
        code: vercode
      }, () => {
        if (vercode.length == this.data.codeLength) {
          api.changePhone({
            telephone: this.data.mobile,
            msgcode: vercode,
          }).then(res => {
            wx.showToast({
              title: '绑定成功',
              icon: 'none'
            })
            app.globalData.userInfo = Object.assign(app.globalData.userInfo, res)
            this.triggerEvent('bindok')
          }).catch(err => {})
        }
      })
    },

    focusBox() {
      // 验证码输入框获取焦点
      this.setData({
        isFocus: true
      })
    },

    handleCloseModal(e) {
      // 关闭弹窗
      this.triggerEvent('closemodal')
    },

    handleBackFirst() {
      // 返回第一个弹窗
      this.setData({
        mobile: '',
        code: [],
        authFlag: true,
        authSecondFlag: false,
        authLastFlag: false
      })
    },

    handleBackSecond() {
      // 返回第二个弹窗
      this.resetCountDown()
      this.setData({
        mobile: '',
        code: [],
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },

    countDown() {
      // 倒计时
      this.resetCountDown()
      this.setData({
        countFlag: true
      })
      this.data.timer = setInterval(() => {
        this.setData({
          count: this.data.count - 1
        }, () => {
          if (this.data.count <= 0) {
            this.resetCountDown()
          }
        })
      }, 1000)
    },


    resetCountDown() {
      // 倒计时重置
      clearInterval(this.data.timer)
      this.setData({
        count: 60,
        countFlag: false
      })
    }

  }
})