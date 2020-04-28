
const util = require('../../utils/util.js')

Component({

  properties: {
    parameter: Object
  },

  data: {
    recover_time: util.formatTime(new Date()).substr(0, 16)
  },

  methods: {
    onChange(e) {
      // 选择结果
      this.setData({
        recover_time: e.detail.dateString
      })
    },

    onSubmit() {
      // 提交
      wx.showModal({
        title: '消息提醒',
        content: '请确认事故现场通行是否已恢复？',
        success: (res) => {
          if (res.confirm) {
            this.data.parameter.recover_time = this.data.recover_time
            this.triggerEvent('bindok', this.data.parameter)
          }
        }
      })
    },

    closeModal() {
      //关闭弹窗
      this.triggerEvent('closemodal')
    }

  }
})
