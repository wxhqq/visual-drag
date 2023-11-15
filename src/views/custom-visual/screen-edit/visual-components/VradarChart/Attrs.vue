<template>
	<ComChartAttrs type="pie" v-bind="$attrs">
		<Panel name="custom" slot="custom">
			<span>绘图区域</span>
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
export default class VradarChartAttrs extends Vue {
	get attrStyle() {
		return this.$attrs.attrStyle
	}

	// 系列设置
	get seriesFormItems() {
		return [
			{
				key: 'shape',
				label: '形状',
				bltype: 'radio',
				type: 'button',
				options: [
					{ value: 'polygon', label: '多边形' },
					{ value: 'circle', label: '圆形' },
				],
			},
			{ key: 'isArea', label: '面积填充', bltype: 'single-checkbox' },
			{
				key: 'centerLeft',
				label: '圆心X坐标',
				bltype: 'inputnumber',
				step: 5,
				min: 0,
				max: 100,
			},
			{ key: 'radiusPercent', label: '半径占比', bltype: 'slot' },
			{ key: 'labelShow', label: '标签', bltype: 'single-checkbox' },
		]
	}
}
</script>
