import HttpRequest from '../utils/request.js'
import {
  getToken
} from '../utils/util.js'
import {
  baseURL
} from '../config.js'

const axios = new HttpRequest(baseURL)

// 上传图片
export const uploadPhoto = (post) => {
  post.body.token = getToken()
  return axios.request({
    upfile: true,
    url: '/miniprogramserver/upload',
    body: post.body,
    filePath: post.filePath,
    progress: post.progress
  })
}

// 获取用户其他信息
export const getUserProfile = () => {
  return axios.request({
    url: '/miniprogramserver/getUserProfile',
    body: {token: getToken()}
  })
}

// 登录
export const mplogin = (post) => {
  return axios.request({
    url: '/miniprogramserver/login',
    body: post
  })
}

// 发送短信验证码
export const sendSms = (telephone) => {
  return axios.request({
    url: '/miniprogramserver/sendSms',
    body: {
      telephone
    }
  })
}

// 绑定手机号
export const changePhone = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/changePhone',
    body: post
  })
}

// 首页加载
export const loadData = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/loadData',
    body: post
  })
}

// 获取区域执法单位
export const getDistrictGroup = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getDistrictGroup',
    body: post
  })
}

// 用户报警
export const reportEvent = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/reportEvent',
    body: post
  })
}

// 获取用户报案记录
export const getUserReportEvents = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getUserReportEvents',
    body: post
  })
}

// 获取案件记录
export const getReportEvents = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getReportEvents',
    body: post
  })
}

// 获取案件信息(管理端)
export const getReportDetail = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getReportDetail',
    body: post
  })
}

// 审理案件
export const acceptReport = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/acceptReport',
    body: post
  })
}

// 填写报送信息
export const reportInfo = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/reportInfo',
    body: post
  })
}

// 保存案件信息
export const saveReportInfo = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/saveReportInfo',
    body: post
  })
}

// 保存当事人信息
export const cardInfo = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/cardInfo',
    body: post
  })
}

// 搜索路产赔损项目
export const searchPropertyItems = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/searchPropertyItems',
    body: post
  })
}

// 保存勘验笔录
export const reportItem = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/reportItem',
    body: post
  })
}

// 下发赔偿通知书
export const reportFile = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/reportFile',
    body: post
  })
}

// 删除报案
export const deleteReport = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/deleteReport',
    body: post
  })
}

// 撤销案件
export const cancelReport = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/cancelReport',
    body: post
  })
}

// 获取赔偿清单
export const getPropertyPayItems = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getPropertyPayItems',
    body: post
  })
}

// 生成交易单
export const createPay = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/createPay',
    body: post
  })
}

// 查询支付
export const payQuery = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/payQuery',
    body: post
  })
}

// 支付参数
export const payParams = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/' + post.payway + '/api',
    body: post
  })
}

// 恢复畅通
export const recoverPass = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/recoverPass',
    body: post
  })
}

// 移交单位人员
export const getGroupBook = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/getGroupBook',
    body: post
  })
}

// 移交案件
export const trunReport = (post) => {
  post.token = getToken()
  let url = post.level === 1 ? '/miniprogramserver/trunReport' : '/miniprogramserver/trunUserReport'
  return axios.request({
    url: url,
    body: post
  })
}

// 查看赔偿通知书
export const paynote = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/word/paynote',
    body: post
  })
}

// 查看卷宗
export const allnote = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/word/allnote',
    body: post
  })
}

// 获取用户信息数
export const getUserCount = () => {
  return axios.request({
    url: '/miniprogramserver/getUserCount',
    body: {
      token: getToken()
    }
  })
}

// 修改用户信息
export const saveUserInfo = (post) => {
  post.token = getToken()
  return axios.request({
    url: '/miniprogramserver/saveUserInfo',
    body: post
  })
}

// 获取报案配置
// export const loadReportConfig = () => {
//   return new Promise((resolve, reject) => {
//     wx.getStorage({
//       key: 'report_config',
//       success(res) {
//         let data = JSON.parse(res.data)
//         // 检查缓存
//         if (data.time > ((new Date()).getTime()) / 1000) {
//           resolve(data)
//         } else {
//           axios.request({
//             url: '/miniprogramserver/loadReportConfig',
//             body: {}
//           }).then(res => {
//             wx.setStorage({
//               key: 'report_config',
//               data: JSON.stringify(res),
//               success: () => {
//                 resolve(res)
//               }
//             })
//           }).catch(err => {
//             reject(err)
//           })
//         }
//       },
//       fail() {
//         axios.request({
//           url: '/miniprogramserver/loadReportConfig',
//           body: {}
//         }).then(res => {
//           wx.setStorage({
//             key: 'report_config',
//             data: JSON.stringify(res),
//             success: () => {
//               resolve(res)
//             }
//           })
//         }).catch(err => {
//           reject(err)
//         })
//       }
//     })
//   })
// }