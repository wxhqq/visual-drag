<template>
	<div>
		<bl-form
			:formItems="formItems"
			:defaultValue="activeComponent"
			:label-width="70"
			itemClass="mb-1"
			class="attr-form-wrap mt-12px"
			:labelColon="false"
			labelPosition="left"
			itemSize="small">
			<div slot="pos" class="flex-justify-start">
				<p class="pos-size-show-cell">
					<span class="mr-4px">X</span>
					<span>{{ activeComponent.propStyle.left }}</span>
				</p>
				<p class="pos-size-show-cell">
					<span class="mr-4px">Y</span>
					<span>{{ activeComponent.propStyle.top }}</span>
				</p>
			</div>
			<div slot="size" class="flex-justify-start">
				<div class="pos-size-show-cell">
					<span class="mr-4px">W</span>
					<InputNumber
						v-model="activeComponent.propStyle.width"
						:precision="0"
						:min="20"
						:max="1920"
						style="width: 60px"
						size="small"
						:disabled="activeComponent.isLock"
						:active-change="false" />
				</div>
				<div class="pos-size-show-cell">
					<span class="mr-4px">H</span>
					<InputNumber
						v-model="activeComponent.propStyle.height"
						:precision="0"
						:min="20"
						:max="1080"
						style="width: 60px"
						size="small"
						:disabled="activeComponent.isLock"
						:active-change="false" />
				</div>
			</div>
		</bl-form>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// 组件通用属性
import VisualScreenStore from '@store/modules/visual-screen'

@Component
export default class CommonAttrs extends Vue {
	get activeComponent() {
		return VisualScreenStore.activeComponent
	}

	// 筛选框配置
	get formItems() {
		return [
			{
				key: 'pos',
				label: '位置',
				bltype: 'slot',
			},
			{ key: 'size', label: '尺寸', bltype: 'slot' },
			{
				key: 'isLock',
				label: '锁定',
				bltype: 'single-checkbox',
			},
			{
				key: 'isShow',
				label: '显示',
				bltype: 'single-checkbox',
			},
		]
	}
}
</script>

<style lang="scss" scoped>
.pos-size-show-cell {
	width: 50%;
}
</style>
