<template>
	<bl-form
		:formItems="formItems"
		:defaultValue="activeComponent"
		:label-width="70"
		itemClass="mb-1"
		class="common-attrs-form"
		:labelColon="false"
		labelPosition="left"
		itemSize="small">
		<Checkbox
			slot="cardTitleShow"
			v-if="this.hasWrapStyle"
			v-model="activeComponent.wrapStyle.showTitle"
			size="small"></Checkbox>
		<ColorPicker
			slot="cardBgColor"
			v-if="this.hasWrapStyle"
			v-model="activeComponent.wrapStyle.cardBgColor"
			transfer
			alpha
			transfer-class-name="dark"
			size="small" />
	</bl-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// 组件通用属性
import VisualDashboardStore from '@store/modules/visual-dashboard'

@Component
export default class CommonAttrs extends Vue {
	get activeComponent() {
		return VisualDashboardStore.activeComponent
	}

	// 多属性组件
	multiAttrComponent = ['VlineChart', 'VbarChart', 'VpieChart', 'VradarChart']

	// 是否存在标题和卡片设置
	get hasWrapStyle() {
		return this.activeComponent.hasOwnProperty('wrapStyle')
	}

	// 筛选框配置
	get formItems() {
		return [
			{
				key: 'cardTitleShow',
				label: '卡片标题',
				bltype: 'slot',
				isHidden: !this.hasWrapStyle,
			},
			{
				key: 'cardBgColor',
				label: '卡片背景',
				bltype: 'slot',
				isHidden: !this.hasWrapStyle,
			},
		]
	}
}
</script>

<style lang="scss" scoped>
.pos-size-show-cell {
	width: 50%;
}

.common-attrs-form {
	padding: 16px 16px 0 16px;
}
</style>
