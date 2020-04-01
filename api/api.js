const HttpRequest = require('../utils/request.js')
const util = require('../utils/util.js')
const config = require('../config.js')

const axios = new HttpRequest(config.baseURL)

// 上传图片
export const uploadPhoto = (post) => {
  post.body.token = util.getToken()
  return axios.request({
    upfile: true,
    url: '/miniprogramServer/upload',
    body: post.body,
    filePath: post.filePath,
    progress: post.progress
  })
}

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

// 用户报警
export const reportEvent = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/reportEvent',
    body: post
  })
}

// 获取用户报案记录
export const getUserReportEvents = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getUserReportEvents',
    body: post
  })
}

// 获取案件记录
export const getReportEvents = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getReportEvents',
    body: post
  })
}

// 获取案件信息(管理端)
export const getReportDetail = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getReportDetail',
    body: post
  })
}

// 审理案件
export const acceptReport = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/acceptReport',
    body: post
  })
}

// 填写报送信息
export const reportInfo = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/reportInfo',
    body: post
  })
}

// 案件处置
export const reloadReport = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/reloadReport',
    body: post
  })
}

// 获取同事
export const getColleague = () => {
  return axios.request({
    url: '/miniprogramServer/getColleague',
    body: { token: util.getToken() }
  })
}

// 保存当事人信息
export const cardInfo = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/cardInfo',
    body: post
  })
}