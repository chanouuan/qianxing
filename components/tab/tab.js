// pages/components/tab/tab.js
Component({

	properties: {
		tabList: {
			type: Array,
			value: []
		},
		currentTab: {
			type: Number,
			value: 0
		}
	},
	
	methods: {
		onClickTab: function (event) {
			const current = event.currentTarget.dataset.current
			if (this.properties.currentTab === current) {
				return false
			}
			this.setData({
				currentTab: event.currentTarget.dataset.current
			}, () => {
				this.triggerEvent('clickTab', {
					current: event.currentTarget.dataset.current
				})
			})
		}

	}
})
