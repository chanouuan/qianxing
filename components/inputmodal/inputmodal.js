
Component({

  properties: {
    parameter: {
      type: Object,
      value: {}
    },
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    maxlength: {
      type: String,
      value: '30'
    },
    placeholder: {
      type: String,
      value: '请输入'
    },
    style: {
      type: String,
      value: 'border-bottom:1rpx solid #999;text-align:left'
    },
    name: {
      type: String,
      value: ''
    }
  },

  methods: {
    onInput(e) {
      this.data.value = e.detail.value
    },

    onSubmit() {
      // 提交
      this.data.parameter.value = this.data.value
      this.triggerEvent('bindok', this.data.parameter)
    },

    closeModal() {
      //关闭弹窗
      this.triggerEvent('closemodal')
    }

  }
})
