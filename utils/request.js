import { setToken } from '../utils/util.js'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      timeout: 10000,
      method: 'POST',
      qs: {},
      body: {},
      proxy: false,
      reset: 0,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return config
  }
  upfile(options) {
    return new Promise((resolve, reject) => {
      let UploadTask = wx.uploadFile({
        url: options.url,
        filePath: options.filePath,
        header: {
          "Content-Type": "multipart/form-data"
        },
        timeout: options.timeout,
        formData: options.body,
        name: 'upfile',
        success: res => {
          const result =  this.response(JSON.parse(res.data))
          if (result.code === 1) {
            resolve(result.data)
          } else if (result.code === 0) {
            reject(result.data)
          } else if (result.code === 2) {
            // 重连
            if (options.reset < 1) {
              options.reset++
              this.resetLogin().then(res => {
                options.body = Object.assign(options.body || {}, res)
                this.upfile(options).then(res => {
                  resolve(res)
                }).catch(err => {
                  reject(err)
                })
              }).catch(err => {
                reject(err)
              })
            } else {
              wx.showToast({
                title: result.data.message,
                icon: 'none',
                duration: 3000
              })
              reject(result.data)
            }        
          }
        },
        fail: err => {
          wx.showToast({
            title: '连接超时，请检查网络！',
            icon: 'none'
          })
          reject(err)
        },
        complete: res => {
          if (options.progress) {
            UploadTask.offProgressUpdate(options.progress)
          }
          UploadTask = null
        }
      })
      if (UploadTask) {
        if (options.progress) {
          UploadTask.onProgressUpdate(options.progress)
        }
      }
    })
  }
  response(data) {
    if (typeof data === 'object') {
      if ('errorcode' in data) {
        if (data.errorcode === 0) {
          // 请求成功
          return { code: 1, data: data.data }
        }
        if (data.errorcode === 3010) {
          // 用户未登录
          setToken('')
          return { code: 2, data: data }
        }
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 3000
        })
      }
    }
    return { code: 0, data: data }
  }
  // cloudMethod(options) {
  //   return new Promise((resolve, reject) => {
  //     wx.cloud.callFunction({
  //       name: 'http_proxy_request',
  //       data: options,
  //     }).then(res => {
  //         this.response(res.result, resolve, reject)
  //       }).catch(err => {
  //         wx.showToast({
  //           title: '连接超时，请检查网络！',
  //           icon: 'none'
  //         })
  //         reject(err)
  //       })
  //   })
  // }
  resetLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 登录
          this.request({
            url: '/miniprogramserver/login',
            body: { code: res.code }
          }).then(res => {
            setToken(res.token)
            resolve({
              token: res.token
            })
          }).catch(err => {
            reject(err)
          })
        },
        fail: err => {
          reject(err)
        }
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
          const result =  this.response(res.data)
          if (result.code === 1) {
            resolve(result.data)
          } else if (result.code === 0) {
            reject(result.data)
          } else if (result.code === 2) {
            // 重连
            if (options.reset < 1) {
              options.reset++
              this.resetLogin().then(res => {
                options.body = Object.assign(options.body || {}, res)
                this.wxMethod(options).then(res => {
                  resolve(res)
                }).catch(err => {
                  reject(err)
                })
              }).catch(err => {
                reject(err)
              })
            } else {
              wx.showToast({
                title: result.data.message,
                icon: 'none',
                duration: 3000
              })
              reject(result.data)
            }        
          }
        },
        fail: err => {
          wx.showToast({
            title: '连接超时，请检查网络！',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  }
  request (options) {
    options = Object.assign(this.getInsideConfig(), options || {})
    options.url = this.baseUrl + options.url;
    if (options.upfile) {
      return this.upfile(options)
    }
    if (options.proxy) {
      // return this.cloudMethod(options)
    } else {
      return this.wxMethod(options)
    }
  }
}

export default HttpRequest