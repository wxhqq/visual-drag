<template>
	<div
		class="visual-data-pannel dark-scroll-bar dark"
		:class="{ close: !isCollapsePanel }">
		<i
			class="icon trigger-btn"
			:class="isCollapsePanel ? 'bl-icon-nav-unfold' : 'bl-icon-nav-fold'"
			@click="isCollapsePanel = !isCollapsePanel"></i>
		<div v-show="!isCollapsePanel" class="data-tip-show">数据</div>
		<header v-show="isCollapsePanel">
			<div class="font-bold fs-16px">数据</div>
			<Dropdown class="date-set-drowndown mt-2">
				<div class="flex-justify-between selected-set">
					<p>{{ selectedDateSet.name }}</p>
					<i class="bl-icon-arrow-down"></i>
				</div>
				<DropdownMenu slot="list">
					<ul class="data-set-list">
						<div
							class="flex-justify-between flex-align-items-center mb-1">
							<Button
								type="text"
								@click="isShowDataSetModal = true">
								预览数据
							</Button>
							<Icon custom="bl-icon-refresh" />
						</div>
						<Input
							v-model="searchSetValue"
							class="mb-8px"
							placeholder="请搜索"
							clearable
							suffix="ios-search" />
						<li
							v-for="(item, key) in filterDateSets"
							:key="key"
							:class="{ actived: item.id === selectedDateSet.id }"
							@click="selectedDateSet = item">
							{{ item.name }}
						</li>
					</ul>
				</DropdownMenu>
			</Dropdown>

			<Input
				v-model="searchDataValue"
				class="mt-2"
				placeholder="请输入关键字"
				clearable
				@on-enter="getDataTreeList"
				suffix="ios-search" />
		</header>
		<section v-show="isCollapsePanel" class="data-tree-contatiner">
			<!-- 维度 -->
			<ComDataTree category="dimension" :treeList="dimensionTreeList" />
			<!-- 度量 -->
			<ComDataTree category="measure" :treeList="measureTreeList" />
		</section>
		<DataSetModal :value.sync="isShowDataSetModal" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DataSetModal from './DataSetModal.vue'
import { DataFieldType } from '../scripts/visual-type'
import ComDataTree from './ComDataTree.vue'

// 数据面板
@Component({
	components: { DataSetModal, ComDataTree },
})
export default class VisualDataPanel extends Vue {
	@Prop() rightTabName: string

	// 是否折叠面板
	isCollapsePanel = false
	// 预览数据集
	isShowDataSetModal = false
	// 搜索数据集
	searchSetValue = ''
	// 当前选中数据集
	selectedDateSet = {
		name: '请选择数据集',
		id: 0,
	}

	// 搜索过滤后的数据集
	get filterDateSets() {
		return this.dataSets.filter(item => {
			return item.name.includes(this.searchSetValue)
		})
	}
	// 数据集
	dataSets = Array.from({ length: 10 }).map((item, i) => {
		return {
			name: `数据集${i + 1}`,
			id: i + 1,
		}
	})

	// 数据维度和度量搜索
	searchDataValue = ''
	// 维度数据
	dimensionTreeList: DataFieldType[] = []
	// 度量数据
	measureTreeList: DataFieldType[] = []

	created() {
		this.getDataTreeList()
	}
	// 获取数列表
	getDataTreeList() {
		// TODO 获取数据带searchDataValue搜索条件
		const dimensionData: DataFieldType[] = Array.from({ length: 7 }).map(
			(item, i) => {
				return {
					name: `维度字段${i + 1}`,
					field: `dimension_field${i + 1}`,
					fieldType: 'string',
					category: 'dimension',
					chrildren: [],
				}
			}
		)
		dimensionData.push({
			name: '更新时间',
			field: 'dimension_field8',
			fieldType: 'datetime',
			category: 'dimension',
			chrildren: [
				{
					name: '更新时间（year）',
					field: 'dimension_field8_year',
					fieldType: 'year',
					category: 'dimension',
				},
				{
					name: '更新时间（month）',
					field: 'dimension_field8_year_month',
					fieldType: 'year-month',
					category: 'dimension',
				},
				{
					name: '更新时间（day）',
					field: 'dimension_field8_year_month_day',
					fieldType: 'year-month-day',
					category: 'dimension',
				},
				{
					name: '更新时间（hour）',
					field: 'dimension_field8_hour',
					fieldType: 'hour',
					category: 'dimension',
				},
				{
					name: '更新时间（minute）',
					field: 'dimension_field8_hour_minute',
					fieldType: 'hour-minute',
					category: 'dimension',
				},
				{
					name: '更新时间（second）',
					field: 'dimension_field8_hour_minute_second',
					fieldType: 'hour-minute-second',
					category: 'dimension',
				},
			],
		})
		this.dimensionTreeList = dimensionData.filter(item => {
			return item.name.includes(this.searchDataValue)
		})

		// --------------------------度量数据----------------------
		const measureData: DataFieldType[] = Array.from({ length: 5 }).map(
			(item, i) => {
				return {
					name: `度量字段${i + 1}`,
					field: `measure_field${i + 1}`,
					fieldType: 'number',
					category: 'measure',
					chrildren: [],
				}
			}
		)

		this.measureTreeList = measureData.filter(item => {
			return item.name.includes(this.searchDataValue)
		})
	}

	@Watch('rightTabName')
	onRightTabChange() {
		this.isCollapsePanel = this.rightTabName === 'data'
	}
}
</script>

<style lang="scss" scoped>
.visual-data-pannel {
	position: absolute;
	width: 200px;
	background-color: $color-grey-92;
	border-top: 1px solid $color-grey-75;
	min-height: 200px;
	top: 0;
	right: 300px;
	bottom: 0;
	z-index: 1000;
	padding: 8px 0;
	color: $color-white-65;
	overflow: hidden;

	transition: all 0.3s;
	header {
		padding: 0 12px;
	}
	// 打开面板
	&.close {
		width: 30px;
	}
	.data-tip-show {
		margin-top: 40px;
		margin-left: 3px;
		writing-mode: vertical-lr;
		user-select: none;
		// color: $color-white-45;
		letter-spacing: 4px;
	}

	.trigger-btn {
		position: absolute;
		right: 6px;
		top: 8px;
		font-size: 18px;
		line-height: 1;
		user-select: none;
	}
}
// 数据集
.date-set-drowndown {
	width: 100%;
}
.selected-set {
	align-items: center;
	padding: 0 8px;
	transition: all 0.3s;
	@include height-lh(32px);

	border: 1px solid $color-grey-75;

	&:hover {
		@include set-theme {
			border-color: get-themed-variable('color-theme-primary');
		}
	}
}
.data-set-list {
	padding: 0 10px;
	li {
		cursor: pointer;
		@include height-lh(28px);
		padding: 0 8px;
		&:hover {
			background-color: #444;
		}
		&.actived {
			@include set-theme {
				background-color: get-themed-variable('color-theme-primary');
			}
		}
	}
}
// 维度和度量
.data-tree-contatiner {
	height: calc(100% - 166px);
}
</style>
