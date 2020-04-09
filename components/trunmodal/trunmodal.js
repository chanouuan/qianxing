
const api = require('../../api/api.js')

Component({

  properties: {
    parameter: Object
  },

  data: {
    level: 0,
    index: [],
    list: []
  },

  lifetimes: {
		attached() {
      let data = {
        level: this.data.parameter.level,
        index: [],
        list: []
      }
      for (let i = 0; i < this.data.parameter.level; i++) {
        data.index.push(0)
        data.list.push([])
      }
      this.setData(data)
      this.getGroupBook(0, 0)
		}
	},

  methods: {
    onChange(e) {
      // 选择结果
      this.setData({
        index: e.detail.value
      })
    },

    onColumnChange(e) {
      // 选择列
      if (e.detail.column < this.data.index.length - 1) {
        // 最后一列不执行
        this.getGroupBook(e.detail.column, e.detail.value)
      }
    },

    onSubmit() {
      // 提交
      // 最后一列的值
      this.data.parameter.value = (this.data.list[this.data.index.length - 1] && this.data.list[this.data.index.length - 1].length) ? this.data.list[this.data.index.length - 1][this.data.index[this.data.index.length - 1]].id : 0
      this.triggerEvent('bindok', this.data.parameter)
    },

    closeModal() {
      //关闭弹窗
      this.triggerEvent('closemodal')
    },

    getGroupBook(column, value) {
      // 加载单位人员
      api.getGroupBook({
        level: this.data.level,
        column: column,
        value: (this.data.list[column] && this.data.list[column].length) ? this.data.list[column][value].id : 0
      }).then(res => {
        for(let n in res) {
          this.data.index[n] = 0
          this.data.list[n] = res[n]
        }
        this.data.index[column] = value
        this.setData({
          index: this.data.index,
          list: this.data.list
        })
      }).catch(err => {})
    }
  }
})
