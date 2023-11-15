<template>
	<bl-form
		class="attr-form-wrap"
		:formItems="formItems"
		:defaultValue="seriesStyle"
		:labelColon="false"
		:label-width="70"
		labelPosition="left"
		itemSize="small"
		itemClass="mb-1">
		<Slider
			slot="radius"
			v-model="seriesStyle.radius"
			show-tip="never"
			:step="5"
			:min="60"
			show-input
			input-size="small"></Slider>
		<div class="flex-align-item-center" slot="alarmItem1">
			<InputNumber
				v-model="seriesStyle.alarmItem1.value"
				:precision="0"
				:min="1"
				:max="seriesStyle.alarmItem2.value || 100"
				size="small"
				:formatter="value => `${value}%`"
				:parser="value => value.replace('%', '')"
				:active-change="false" />
			<ColorPicker
				v-model.trim="seriesStyle.alarmItem1.color"
				transfer
				:alpha="true"
				size="small"
				transfer-class-name="dark"
				class="ml-16px" />
		</div>
		<div class="flex-align-item-center" slot="alarmItem2">
			<InputNumber
				v-model="seriesStyle.alarmItem2.value"
				:precision="0"
				:min="seriesStyle.alarmItem1.value || 0"
				:max="100"
				size="small"
				:formatter="value => `${value}%`"
				:parser="value => value.replace('%', '')"
				:active-change="false" />
			<ColorPicker
				v-model.trim="seriesStyle.alarmItem2.color"
				transfer
				:alpha="true"
				size="small"
				transfer-class-name="dark"
				class="ml-16px" />
		</div>
	</bl-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// 组件属性

@Component
export default class VgaugeChartAttrs extends Vue {
	get seriesStyle() {
		return this.$attrs.attrStyle['series']
	}

	// 系列设置
	get formItems() {
		return [
			{
				key: 'min',
				label: '起点值',
				bltype: 'inputnumber',
				step: 5,
				min: 0,
				max: 1000000,
			},
			{
				key: 'max',
				label: '终点值',
				bltype: 'inputnumber',
				step: 5,
				min: 0,
				max: 1000000,
			},
			{ key: 'radius', label: '半径占比', bltype: 'slot' },
			{
				key: 'color',
				label: '表盘颜色',
				bltype: 'color',
				transferClass: 'dark',
			},
			{ key: 'unit', label: '数值单位', maxlength: 10 },
			{ key: 'isAlarm', label: '告警设置', bltype: 'single-checkbox' },
			{
				key: 'alarmItem1',
				label: '告警阈值1',
				bltype: 'slot',
				isHidden: !this.seriesStyle.isAlarm,
			},
			{
				key: 'alarmItem2',
				label: '告警阈值2',
				bltype: 'slot',
				isHidden: !this.seriesStyle.isAlarm,
			},
		]
	}
}
</script>
<style lang="scss" scoped>
@import '../../../styles/visual-screen/coolapse.scss';
</style>
