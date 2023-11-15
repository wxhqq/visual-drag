<template>
	<ComChartAttrs type="pie" v-bind="$attrs">
		<Panel name="series" slot="series">
			<span>扇区和标签</span>
			<div slot="content">
				<bl-form
					:formItems="seriesFormItems"
					:defaultValue="attrStyle.series"
					:label-width="80"
					itemSize="small"
					:labelColon="false"
					labelPosition="left"
					itemClass="mb-1">
					<Slider
						slot="radiusPercent"
						show-tip="never"
						v-model="attrStyle.series.radiusPercent"
						:step="5"
						:min="25"
						show-input
						input-size="small"></Slider>
				</bl-form>
			</div>
		</Panel>
	</ComChartAttrs>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ComChartAttrs from '../common/ComChartAttrs.vue'

// 组件属性

@Component({
	components: {
		ComChartAttrs,
	},
})
export default class VpieChartAttrs extends Vue {
	get attrStyle() {
		return this.$attrs.attrStyle
	}

	// 系列设置
	get seriesFormItems() {
		const { labelShow, isRing } = this.attrStyle['series']
		return [
			{
				key: 'centerLeft',
				label: '圆心X坐标',
				bltype: 'inputnumber',
				step: 5,
				min: 0,
				max: 100,
			},
			{ key: 'radiusPercent', label: '半径占比', bltype: 'slot' },
			{ key: 'isRing', label: '环状展示', bltype: 'single-checkbox' },
			{
				key: 'ringWidth',
				label: '环宽占比',
				isHidden: !isRing,
				bltype: 'inputnumber',
				min: 5,
				max: 40,
			},
			{ key: 'labelShow', label: '标签', bltype: 'single-checkbox' },
			{
				key: 'percentPrecision',
				label: '精度',
				bltype: 'radio',
				type: 'button',
				options: [0, 1, 2],
				disabled: !labelShow,
			},
			{
				key: 'labelContent',
				label: '标签内容',
				bltype: 'checkbox',
				disabled: !labelShow,
				options: [
					{ value: 'name', label: '名称' },
					{ value: 'value', label: '值' },
					{ value: 'percent', label: '百分比' },
				],
			},
			{
				key: 'labelPostion',
				label: '标签位置',
				bltype: 'radio',
				type: 'button',
				disabled: !labelShow,
				options: [
					{ value: 'outside', label: '默认' },
					{ value: 'edge', label: '边缘' },
					{ value: 'inside', label: '内部' },
				],
			},
		]
	}
}
</script>
