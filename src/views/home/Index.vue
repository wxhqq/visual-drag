<template>
	<div class="index-wrap">
		<Menu mode="horizontal" active-name="1">
			<MenuItem name="1" to="/">
				<Icon type="ios-home" />
				Home
			</MenuItem>
			<MenuItem name="2" to="/dashboardEdit">
				<Icon type="ios-paper" />
				自定义仪表盘
			</MenuItem>
			<MenuItem name="3" to="/screenEdit">
				<Icon type="ios-people" />
				自定义大屏
			</MenuItem>
		</Menu>
		<bl-form class="mt-2" :formItems="formItems" :defaultValue="formData" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CommonStore from '@store/modules/common'
@Component
export default class Home extends Vue {
	// 外观设置信息
	formData = {
		theme: CommonStore.theme,
		background: CommonStore.background,
	}

	get formItems() {
		return [
			{
				key: 'theme',
				label: '主题色',
				bltype: 'radio',
				options: [
					{ label: '绿', value: 'green' },
					{ label: '蓝', value: 'blue' },
				],
				onChange: () => {
					CommonStore.updateData({
						key: 'theme',
						data: this.formData.theme,
					})
					CommonStore.initAppearance()
				},
			},
		]
	}
}
</script>
<style lang="scss" scoped>
//二级菜单子菜单激活时，二级菜单高亮
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
	@include set-theme {
		color: get-themed-variable('color-theme-secondary');
		border-bottom: 2px solid get-themed-variable('color-theme-secondary');
	}
}
</style>
