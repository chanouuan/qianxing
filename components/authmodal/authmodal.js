// components/authmodal/authmodal.js

//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    userInfo: {},
    hasUserInfo: false,
    mobile: ''
  },

  lifetimes: {
    created () {
      // 隐藏
      setTimeout(() => {
        wx.hideTabBar()
      }, 300)
    },
    attached () {
      // 获取用户信息
      app.getUserInfo().then(res => {
        this.setData(res)
      })
    },
    detached () {
      // 显示
      this.resetCountDown()
      setTimeout(() => {
        wx.showTabBar()
      }, 300)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //点击微信授权
    handleWxAuth(e) {
      wx.showLoading({
        title: '加载中'
      })
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      if (!iv) {
        wx.hideLoading()
        wx.showToast({
          title: '取消授权',
          icon: 'none'
        })
      }
      wx.showToast({
        title: '授权成功',
        icon: 'none'
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
      let count = this.data.count
      let mobile = this.data.mobile
      if (!/^1[0-9]{10}$/.test(mobile)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
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
    },

    // 重新发送
    handleRefreshSend() {
      let mobile = this.data.mobile
      wx.showToast({
        title: '验证码已发送',
        icon: 'none'
      })
      this.countDown()
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
        wx.login({
          success: code => {
            if (!code) {
              return
            }
            wx.showToast({
              title: '绑定成功',
              icon: 'none'
            })
            this.triggerEvent('bindok')
            this.handleCloseModal()
          }
        })
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
