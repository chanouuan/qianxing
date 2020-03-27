const util = require('../utils/util.js')

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      timeout: 5000,
      method: 'POST',
      qs: {},
      body: {},
      proxy: false,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return config
  }
  response(data, resolve, reject) {
    if (typeof data === 'object') {
      if ('errorcode' in data) {
        if (data.errorcode === 0) {
          // 请求成功
          resolve(data.data)
          return true
        }
        // 用户未登录
        if (data.errorcode === 3010) {
          util.setToken('')
        }
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    }
    reject(data)
    return false
  }
  cloudMethod(options) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'http_proxy_request',
        data: options,
      }).then(res => {
          this.response(res.result, resolve, reject)
        }).catch(err => {
          wx.showToast({
            title: '连接超时，请检查网络！',
            icon: 'none'
          })
          reject(err)
        })
    })
  }
  wxMethod(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method,
        data: options.body,
        header: options.headers,
        timeout: options.timeout,
        dataType: 'json',
        success: res => {
          this.response(res.data, resolve, reject)
        },
        fail: err => {
          wx.showToast({
            title: '连接超时，请检查网络！',
            icon: 'none'
          })
          reject(err)
        },
        complete: res => {
        }
      })
    })
  }
  request (options) {
    options = Object.assign(this.getInsideConfig(), options || {})
    options.url = this.baseUrl + options.url;
    if (options.proxy) {
      return this.cloudMethod(options)
    } else {
      return this.wxMethod(options)
    }
  }
}

module.exports = HttpRequest