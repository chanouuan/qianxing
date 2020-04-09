// pages/user/propertypay/propertypay.js

const api = require('../../../api/api.js')

Page({

  data: {
    submit: false,
    pageFlag: false,
    report_id: 0,
    items: [],
    pay: 0
  },

  onLoad: function(options) {
    this.data.report_id = options.report_id
    wx.showLoading({
      title: '加载中...'
    })
    api.getPropertyPayItems({
      report_id: this.data.report_id
    }).then(res => {
      wx.hideLoading()
      res = res || []
      res.forEach(n => {
        this.data.pay += n.total_money
      })
      this.setData({
        items: res,
        pay: this.data.pay,
        pageFlag: true
      })
    }).catch(err => {
      // 获取失败
      wx.navigateBack()
    })
  },

  paySuccess() {
    // 支付成功
    wx.showToast({
      mask: true,
      icon: 'success',
      title: '支付成功',
      duration: 3000
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 3000)
  },

  createpay() {
    // 支付
    if (this.data.submit) {
      return
    }
    this.setData({
      submit: true
    })
    let payway = 'wxpayjs'
    // 生成
    api.createPay({ order_id: this.data.report_id, source: 1, payway: payway}).then(trade_id => {
      // 查询
      api.payQuery({ trade_id: trade_id.trade_id}).then(query => {
        if (query.pay_result === 'SUCCESS') {
          // 支付成功
          this.paySuccess()
        } else {
          // api
          api.payParams({ trade_id: trade_id.trade_id, payway: payway}).then(pay => {
            this.setData({
              submit: false
            })
            // 支付
            wx.requestPayment({
              timeStamp: pay.timestamp,
              nonceStr: pay.nonceStr,
              package: pay.package,
              signType: pay.signType,
              paySign: pay.paySign,
              success: pay => {
                if (pay.errMsg == "requestPayment:ok") {
                  // 支付成功
                  this.paySuccess()
                }
              },
              fail: err => {
                wx.showToast({
                  title: '支付失败，请重新支付',
                  icon: 'none'
                })
              }
            })
          }).catch(err => {
            this.setData({
              submit: false
            })
          })
        }
      }).catch(err => {
        this.setData({
          submit: false
        })
      })
    }).catch(err => {
      this.setData({
        submit: false
      })
    })
  }
})