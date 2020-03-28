const HttpRequest = require('../utils/request.js')
const util = require('../utils/util.js')
const config = require('../config.js')

const axios = new HttpRequest(config.baseURL)

// 登录
export const login = (post) => {
  return axios.request({
    url: '/miniprogramServer/login',
    body: post
  })
}

// 发送短信验证码
export const sendSms = (telephone) => {
  return axios.request({
    url: '/miniprogramServer/sendSms',
    body: { telephone }
  })
}

// 绑定手机号
export const changePhone = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/changePhone',
    body: post
  })
}

// 获取用户案件
export const getUserReportEvents = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getUserReportEvents',
    body: post
  })
}