<template>
	<Collapse class="coolapse-wrap" simple>
		<slot name="custom"></slot>
		<Panel name="grid" v-if="type !== 'pie'">
			<span>图表边距</span>
			<bl-form
				slot="content"
				:formItems="gridFormItems"
				:defaultValue="attrStyle.grid"
				:label-width="40"
				cols="2"
				:labelColon="false"
				labelPosition="left"
				itemSize="small"
				itemClass="mb-1"></bl-form>
		</Panel>
		<Panel name="colorType">
			<span>调色盘</span>
			<template slot="content">
				<Select
					size="small"
					transfer
					transfer-class-name="dark"
					v-model="attrStyle.colorType"
					class="mb-12px">
					<Option
						v-for="(colors, key) in CHART_COLOR_MAP"
						:key="key"
						:value="key"
						:label="`色系${key}`">
						<ul class="flex-justify-start color-option-wrap">
							<li
								v-for="(color, index) in colors.slice(0, 10)"
								:key="index"
								:style="{ background: color }"></li>
							<span>色系{{ key }}</span>
						</ul>
					</Option>
				</Select>
			</template>
		</Panel>
		<Panel name="legend">
			<div class="collapse-header">
				<span>图例</span>
				<i-switch v-model="attrStyle.legend.show" size="small" />
			</div>
			<bl-form
				slot="content"
				:formItems="legendFormItems"
				:defaultValue="attrStyle.legend"
				:label-width="70"
				itemSize="small"
				:labelColon="false"
				labelPosition="left"
				itemClass="mb-1"></bl-form>
		</Panel>
		<Panel name="tooltip" hide-arrow class="tooltip-panel">
			<div class="collapse-header">
				<span>工具提示</span>
				<i-switch v-model="attrStyle.tooltip.show" size="small" />
			</div>
		</Panel>
		<Panel name="xAxis" v-if="type !== 'pie'">
			<div class="collapse-header">
				<span>X坐标轴</span>
				<i-switch v-model="attrStyle.xAxis.show" size="small" />
			</div>
			<div slot="content">
				<bl-form
					:formItems="axisFormItems('xAxis')"
					:defaultValue="attrStyle.xAxis"
					:label-width="70"
					itemSize="small"
					:labelColon="false"
					labelPosition="left"
					itemClass="mb-1"></bl-form>
			</div>
		</Panel>
		<Panel name="yAxis" v-if="type !== 'pie'">
			<div class="collapse-header">
				<span>y坐标轴</span>
				<i-switch v-model="attrStyle.yAxis.show" size="small" />
			</div>
			<div slot="content">
				<bl-form
					:formItems="axisFormItems('yAxis')"
					:defaultValue="attrStyle.yAxis"
					:label-width="70"
					itemSize="small"
					:labelColon="false"
					labelPosition="left"
					itemClass="mb-1"></bl-form>
			</div>
		</Panel>
		<slot name="series"></slot>
	</Collapse>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CHART_COLOR_MAP } from '../../scripts/constants'
import { ChartType } from '../../scripts/echart-options'
// 组件属性
// import VisualScreenStore from '@store/modules/visual-screen'
// 图标grid根据legend位置的值
const gridBylegendPos = {
	top: 30,
	left: 110,
	right: 110,
	bottom: 30,
}

@Component
export default class ComChartAttrs extends Vue {
	@Prop({ default: '', required: true }) type: ChartType

	CHART_COLOR_MAP = CHART_COLOR_MAP

	get attrStyle() {
		return this.$attrs.attrStyle
	}

	// 标记点选项
	symbolOption = {
		emptyCircle: '',
		circle: '',
		none: '无',
	}

	// 容器边距
	get gridFormItems() {
		return [
			{
				key: 'top',
				label: '上',
				bltype: 'inputnumber',
				min: 16,
				max: 100,
			},
			{
				key: 'bottom',
				label: '下',
				bltype: 'inputnumber',
				min: 0,
				max: 500,
			},
			{
				key: 'left',
				label: '左',
				bltype: 'inputnumber',
				min: 16,
				max: 500,
			},
			{
				key: 'right',
				label: '右',
				bltype: 'inputnumber',
				min: 16,
				max: 500,
			},
		]
	}
	// 图例
	get legendFormItems() {
		const legend = this.attrStyle['legend']
		const isHorizontalLegend = ['top', 'bottom'].includes(
			this.attrStyle['legend'].position
		)
		return [
			{
				key: 'position',
				label: '位置',
				bltype: 'radio',
				type: 'button',
				disabled: !legend.show,
				options: [
					{ label: '上', value: 'top' },
					{ label: '下', value: 'bottom' },
					{ label: '左', value: 'left' },
					{ label: '右', value: 'right' },
				],
				onChange: () => {
					if (legend.show) {
						const grid = {
							left: 16,
							right: 16,
							bottom: 0,
							top: 30,
						}
						grid[legend.position] = gridBylegendPos[legend.position]
						this.attrStyle['grid'] = grid
					}
				},
			},
			{
				key: 'top',
				label: '对齐方式',
				bltype: 'radio',
				type: 'button',
				disabled: !legend.show,
				isHidden: isHorizontalLegend,
				options: [
					{ label: '顶部', value: 'top' },
					{ label: '居中', value: 'middle' },
					{ label: '底部', value: 'bottom' },
				],
			},
			{
				key: 'left',
				label: '对齐方式',
				bltype: 'radio',
				type: 'button',
				disabled: !legend.show,
				isHidden: !isHorizontalLegend,
				options: [
					{ label: '居左', value: 'left' },
					{ label: '居中', value: 'center' },
					{ label: '居右', value: 'right' },
				],
			},
		]
	}

	// x轴
	axisFormItems(axisType: string) {
		const axis = this.attrStyle[axisType]
		return [
			{
				key: 'labelRule',
				label: '标签显示',
				bltype: 'radio',
				type: 'button',
				disabled: !axis.show,
				isHidden: axisType === 'yAxis',
				options: [
					{ label: '自动', value: 'auto' },
					{ label: '倾斜', value: 'rotate' },
				],
			},
			{
				key: 'name',
				label: '标题',
				isHidden: axisType === 'xAxis',
				disabled: !axis.show,
			},
			{
				key: 'unit',
				label: '单位',
				isHidden: axisType === 'xAxis',
				disabled: !axis.show,
			},
			{
				key: 'lineShow',
				label: '轴线',
				bltype: 'single-checkbox',
				disabled: !axis.show,
			},
			{
				key: 'tickShow',
				label: '刻度',
				bltype: 'single-checkbox',
				disabled: !axis.show,
			},
			{
				key: 'splitLineShow',
				label: '分割线',
				bltype: 'single-checkbox',
				disabled: !axis.show,
			},
		]
	}
}
</script>

<style lang="scss" scoped>
@import '../../../styles/visual-screen/coolapse.scss';
.collapse-header {
	width: 218px;
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
}
.color-option-wrap {
	align-items: center;
	height: 100%;
	li {
		@include size(12px);
		border-radius: 3px;
		margin-right: 4px;
	}
}

::v-deep .tooltip-panel {
	.collapse-header {
		margin-left: 28px;
	}
	.ivu-collapse-header {
		border: none !important;
		cursor: default;
		user-select: none;
	}
	.ivu-collapse-content {
		display: none;
	}
}
</style>
