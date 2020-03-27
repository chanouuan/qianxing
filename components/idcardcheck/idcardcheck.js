// components/idcardcheck/idcardcheck.js
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
    codeLength: 4,
    code: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //验证码输入验证
    inputCode(e) {
      let vercode = e.detail.value
      this.setData({
        code: vercode
      }, () => {
        if (vercode.length < this.data.codeLength) {
          return
        }
        this.triggerEvent('bindok', {idcard: vercode})
      })
    },

    // 验证码输入框获取焦点
    focusBox() {
      this.setData({
        isFocus: true
      })
    },

    //关闭弹窗
    closeModal(e) {
      this.triggerEvent('closemodal')
    }
  }
})
