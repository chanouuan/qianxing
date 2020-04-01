// components/keyboard/keyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keyboardFlag: { //显示键盘
      type: Boolean
    },
    provinceFlag: { //省份键盘
      type: Boolean
    },
    showNumFlag: { //数字键盘
      type: Boolean
    },
    licenseList: {
      type: Array
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    provinceArr: ["贵", "粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "港", "澳"],
    numArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    letterArr: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],

    provinceFlag: true,
    showNumFlag: false,
    license_act: 0,
    
  },
  attached: function() {
    this.setData({
      selectLicense: this.data.licenseList,
      license_act: this.data.licenseList.length
    })
  
   
  },
  observers: {
    'selectLicense': function(list) {
      if (list.length < 1) {
        this.setData({
          provinceFlag: true
        })
      } else if (list.length == 1) {
        this.setData({
          showNumFlag: false,
          provinceFlag: false
        })
      } else if (list.length >= 1) {
        this.setData({
          showNumFlag: true
        })
      }
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    nodata () {
      // empty
    },
    //显示车牌键盘
    handleShowKeyboard(e) {
      let index = this.data.license_act
      let list = this.data.selectLicense
      if (list.length < 1) {
        this.setData({
          provinceFlag: true
        })
      } else if (list.length == 1) {
        this.setData({
          showNumFlag: false,
          provinceFlag: false
        })
      } else if (list.length >= 1) {
        this.setData({
          showNumFlag: true
        })
      }

    },
    //选择车牌键盘
    handleSelectLicense(e) {

      let value = e.currentTarget.dataset.value;
      let act = Number(this.data.license_act)
      if (act >= 8) {
        return
      }
      let arr = this.data.selectLicense;
      arr.push(value);
      this.setData({
        selectLicense: arr,
        license_act: act == 8 ? 8 : act + 1,
      }, () => {
        this.triggerEvent('setlicense', {
          license_num: arr
        })
      })
    },
    //回退
    handleDeleteLicense() {
      
      let index = this.data.license_act;
      let arr = this.data.selectLicense
      arr.pop()
      if (index <= 0) {
        this.setData({
          keyboardFlag: false,
          license_act: 0,
          selectLicense: []
        }, () => {
          this.triggerEvent('setlicense', {
            license_num: []
          })
        })
        return
      }
      if (index == 1) {
        this.setData({
          provinceFlag: true
        })
      } else if (index == 2) {
        this.setData({
          provinceFlag: false,
          showNumFlag: false
        })
      }
      this.setData({
        license_act: index - 1,
        selectLicense: arr
      }, () => {
        this.triggerEvent('setlicense', {
          license_num: arr
        })
      })

    },
    handleCloseKeyboard() {
      this.triggerEvent('closeBoard')
    }

  }
})