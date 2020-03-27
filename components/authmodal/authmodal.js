// components/authmodal/authmodal.js

const api = require('../../api/api.js')

//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideTabBar: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    authFlag: true,
    authSecondFlag: false,
    authLastFlag: false,
    count: 60,
    codeLength: 6,
    mobile: ''
  },

  lifetimes: {
    created () {
      //
    },
    attached () {
      // 隐藏TabBar
      if (this.properties.hideTabBar) {
        wx.hideTabBar()
      }
    },
    detached () {
      // 显示TabBar
      this.resetCountDown()
      if (this.properties.hideTabBar) {
        wx.showTabBar()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //点击微信授权
    handleWxAuth(e) {
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      if (!encryptedData || !iv) {
        wx.showToast({
          title: '取消授权',
          icon: 'none'
        })
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

    //点击短信验证
    handleTelAuth () {
      this.setData({
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },

    //输入手机号
    handleEnterTel (e) {
      this.setData({
        mobile: e.detail.value
      })
    },

    //获取验证码
    handleGetCode () {
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

    //验证码输入验证
    inputCode(e) {
      let mobile = this.data.mobile
      let vercode = e.detail.value
      this.setData({
        code: vercode
      }, () => {
        if (vercode.length < this.data.codeLength) {
          return
        }
        api.changePhone({
          telephone: mobile,
          msgcode: vercode,
        }).then(res => {
          wx.showToast({
            title: '绑定成功',
            icon: 'none'
          })
          app.globalData.userInfo = Object.assign(app.globalData.userInfo, res)
          this.triggerEvent('bindok')
        }).catch(err => {})
      })
    },

    // 验证码输入框获取焦点
    focusBox() {
      this.setData({
        isFocus: true
      })
    },

    //关闭弹窗
    handleCloseModal (e) {
      let flag = e ? true : false
      this.setData({
        authFlag: true,
        authSecondFlag: false,
        authLastFlag: false
      })
      this.triggerEvent('closemodal', {
        flag: flag,
      })
    },

    //返回第一个弹窗
    handleBackFirst () {
      this.setData({
        authFlag: true,
        authSecondFlag: false,
        authLastFlag: false
      })
    },

    //返回第二个弹窗
    handleBackSecond () {
      this.resetCountDown()
      this.setData({
        authFlag: false,
        authSecondFlag: true,
        authLastFlag: false
      })
    },

    //倒计时
    countDown () {
      let countDownNum = this.data.count;
      this.setData({
        timer: setInterval(() => {
          countDownNum--;
          this.setData({
            count: countDownNum
          })
          if (countDownNum <= 0) {
            this.resetCountDown()
          }
        }, 1000),
        countFlag: true
      })
    },

    // 倒计时重置
    resetCountDown () {
      clearInterval(this.data.timer)
      this.setData({
        count: 60,
        countFlag: false
      })
    }

  }
})
