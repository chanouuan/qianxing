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

// 获取区域执法单位
export const getDistrictGroup = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getDistrictGroup',
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

// 搜索路产赔损项目
export const searchPropertyItems = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/searchPropertyItems',
    body: post
  })
}

// 保存勘验笔录
export const reportItem = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/reportItem',
    body: post
  })
}

// 下发赔偿通知书
export const reportFile = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/reportFile',
    body: post
  })
}

// 删除报案
export const deleteReport = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/deleteReport',
    body: post
  })
}

// 撤销案件
export const cancelReport = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/cancelReport',
    body: post
  })
}

// 获取赔偿清单
export const getPropertyPayItems = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getPropertyPayItems',
    body: post
  })
}

// 生成交易单
export const createPay = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/createPay',
    body: post
  })
}

// 查询支付
export const payQuery = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/payQuery',
    body: post
  })
}

// 支付参数
export const payParams = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/' + post.payway + '/api',
    body: post
  })
}

// 移交单位人员
export const getGroupBook = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/miniprogramServer/getGroupBook',
    body: post
  })
}

// 移交案件
export const trunReport = (post) => {
  post.token = util.getToken()
  let url = post.level === 1 ? '/miniprogramServer/trunReport' : '/miniprogramServer/trunUserReport'
  return axios.request({
    url: url,
    body: post
  })
}

// 查看赔偿通知书
export const paynote = (post) => {
  post.token = util.getToken()
  return axios.request({
    url: '/word/paynote',
    body: post
  })
}
