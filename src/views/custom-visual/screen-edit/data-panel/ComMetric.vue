<template>
	<section class="config-block-wrap" :class="category">
		<p class="flex-justify-between title">
			<span>{{ title }}</span>
			<span v-if="limit > 0">
				{{ addedMetricsList.length }}/{{ limit }}
			</span>
		</p>
		<ul class="mt-8px">
			<draggable
				v-model="addedMetricsList"
				:group="dragReceiver"
				animation="200"
				@add="onAddMetric"
				class="drag-receiver-wrap">
				<div v-for="(item, index) in addedMetricsList" :key="index">
					<Dropdown
						trigger="click"
						style="width: 100%"
						transfer
						placement="bottom-start"
						transfer-class-name="dark dark-scroll-bar">
						<li class="added-item" :class="item.category">
							<p class="show-info ellipsis-1">
								<i :class="filedTypeIconMap[item.fieldType]" />
								<span class="ml-4px data-name">
									{{ item.name }}
								</span>
							</p>
							<span
								class="white-space-pre"
								v-show="item.aggregate">
								({{ item.aggregate }})
							</span>
							<span class="operation-icon">
								<i
									v-show="item.sort == 'asc'"
									class="bl-icon-asc"></i>
								<i
									v-show="item.sort == 'desc'"
									class="bl-icon-desc"></i>
								<i
									class="bl-icon-delete ml-4px"
									@click.stop.prevent="
										onDeleteItem(item)
									"></i>
								<i class="bl-icon-arrow-down ml-4px"></i>
							</span>
						</li>
						<DropdownMenu slot="list">
							<Dropdown
								placement="right-start"
								transfer
								transfer-class-name="dark dark-scroll-bar">
								<DropdownItem>
									排序
									<Icon type="ios-arrow-forward"></Icon>
								</DropdownItem>
								<DropdownMenu slot="list">
									<DropdownItem
										v-for="menu in sortMenuList"
										:key="menu.value">
										{{ menu.label }}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<DropdownItem
								@click.native="onShowNameSettings(item)">
								显示名设置
							</DropdownItem>
							<DropdownItem
								v-if="item.category === 'measure'"
								@click.native="onFormatSettings(item)">
								数据格式
							</DropdownItem>
							<Dropdown
								v-if="item.category === 'measure'"
								placement="right-start"
								transfer
								transfer-class-name="dark dark-scroll-bar">
								<DropdownItem>
									聚合方式
									<Icon type="ios-arrow-forward"></Icon>
								</DropdownItem>
								<DropdownMenu
									slot="list"
									class="dark-scroll-bar">
									<DropdownItem
										v-for="menu in aggregationMenuList"
										:key="menu.value">
										{{ menu.label }}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div class="no-data" v-show="!addedMetricsList.length">
					<i class="bl-icon-input"></i>
					<span>
						请拖入{{
							!category
								? '数据'
								: category === 'dimension'
								? '维度'
								: '度量'
						}}字段
					</span>
				</div>
			</draggable>
		</ul>
		<ComShowNameSettingsModal
			:value.sync="isShowNameModal"
			:dataInfo="currentShowNameInfo" />
		<ComFormatSettingsModal
			:value.sync="isFormatSettingsModal"
			:dataInfo="currentFormatSettingsInfo" />
	</section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import ComShowNameSettingsModal from './ComShowNameSettingsModal.vue'
import ComFormatSettingsModal from './ComFormatSettingsModal.vue'
import { dataFiledTypeIconMap } from '../scripts/constants'
import { ComponentMetricType, DataFieldType } from '../scripts/visual-type'
// 通用的维度、度量、指标

@Component({
	components: { draggable, ComShowNameSettingsModal, ComFormatSettingsModal },
})
export default class VisuaMetric extends Vue {
	@Prop() title: string
	@Prop({ default: '' }) category: 'dimension' | 'measure' | ''
	@Prop({ default: -1 }) limit: number //数量限制  默认不限制

	// 字段类型图标
	filedTypeIconMap = dataFiledTypeIconMap

	// 数据格式配置
	get dataConfigs() {
		return this.$attrs.componentData['dataConfigs']
	}
	// 已经添加的指标或度量
	addedMetricsList: (ComponentMetricType | DataFieldType)[] = []

	// 显示名设置
	isShowNameModal = false
	currentShowNameInfo = {}

	// 数据格式设置
	isFormatSettingsModal = false
	currentFormatSettingsInfo = {}

	//接收组
	get dragReceiver() {
		return {
			name: 'dragReceiver',
			put: (to: any, from: any, dragEl: HTMLElement) => {
				// 不是规定类型不允许添加
				const curCategory = dragEl.getAttribute('category')
				if (this.category && this.category !== curCategory) {
					return false
				}
				// 数量超过限制 不允许添加
				if (
					this.limit > 0 &&
					this.addedMetricsList.length >= this.limit
				) {
					return false
				}
				// 判断是否重复
				const curField = dragEl.getAttribute('field')
				const isRepeat = this.addedMetricsList.some(item => {
					return (
						item['field'] === curField &&
						item['category'] === curCategory
					)
				})
				return !isRepeat
			},
		}
	}

	// 过滤菜单
	aggregationMenuList = [
		{
			label: '无聚合',
			value: 'none',
		},
		{
			label: '求和',
			value: 'sum',
		},
		{
			label: '平均值',
			value: 'average',
		},
		{
			label: '计数',
			value: 'count',
		},
		{
			label: '去重计数',
			value: 'dedup-count',
		},
		{
			label: '最大值',
			value: 'max',
		},
		{
			label: '最小值',
			value: 'min',
		},
	]
	// 排序菜单
	sortMenuList = [
		{
			label: '无',
			value: 'none',
		},
		{
			label: '降序',
			value: 'desc',
		},
		{
			label: '升序',
			value: 'asc',
		},
	]

	// 拖拽添加指标或度量
	onAddMetric(e: MouseEvent) {
		const addIndex = e['newIndex']
		const component = this.$attrs.componentData['component']
		this.addedMetricsList.forEach((item, index) => {
			if (addIndex === index) {
				item['sort'] = 'none'
				if (item.category === 'measure') {
					item['aggregate'] =
						component === 'Vtable' ? 'none' : 'count'
				}
			}
		})
		this.updateConfigData()
	}

	// 删除项
	onDeleteItem(info: {}) {
		this.addedMetricsList = this.addedMetricsList.filter(item => {
			return item['field'] !== info['field']
		})
		this.updateConfigData()
	}

	// 更新数据配置
	updateConfigData() {
		this.dataConfigs[`${this.category}s`] = this.addedMetricsList.map(
			item => {
				const res = {
					field: item.field, //字段
					fieldType: item.fieldType,
					sort: item['sort'],
				}
				if (this.category === 'measure') {
					res['aggregate'] = item['aggregate']
				}
				return res
			}
		)
	}

	// 显示名设置
	onShowNameSettings(info: {}) {
		this.isShowNameModal = true
		this.currentShowNameInfo = info
	}

	// 显示名设置
	onFormatSettings(info: {}) {
		this.isFormatSettingsModal = true
		this.currentFormatSettingsInfo = info
	}
}
</script>
<style lang="scss" scoped>
.config-block-wrap.dimension {
	background: rgba($dimension-color, 0.25);
	.title {
		border-color: $dimension-color;
	}
}
.config-block-wrap.measure {
	background: rgba($measure-color, 0.25);
	.title {
		border-color: $measure-color;
	}
}
</style>
