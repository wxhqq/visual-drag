<template>
	<section class="config-block-wrap">
		<p class="title">过滤器</p>
		<ul class="mt-8px">
			<draggable
				v-model="addedFilterList"
				:group="dragReceiver"
				animation="200"
				class="drag-receiver-wrap"
				@add="onFilter">
				<div v-for="(item, index) in addedFilterList" :key="index">
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
							<span class="operation-icon">
								<i
									class="bl-icon-delete"
									@click.stop.prevent="
										onDeleteItem(item)
									"></i>
								<i class="bl-icon-arrow-down ml-4px"></i>
							</span>
						</li>
						<DropdownMenu slot="list">
							<DropdownItem
								@click.native="onFilterSettings(item)">
								过滤
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
								<DropdownMenu slot="list">
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
				<div class="no-data" v-show="!addedFilterList.length">
					<i class="bl-icon-input"></i>
					<span>请拖入数据字段</span>
				</div>
			</draggable>
		</ul>
		<ComFilterSettingsModal
			:value.sync="isShowFilterModal"
			:dataInfo="currentFilterInfo" />
	</section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import draggable from 'vuedraggable'

import ComFilterSettingsModal from './ComFilterSettingsModal.vue'
import { dataFiledTypeIconMap } from '../scripts/constants'
// 过滤器组件

@Component({
	components: { draggable, ComFilterSettingsModal },
})
export default class VisualDataFilter extends Vue {
	addedFilterList = []

	isShowFilterModal = false
	currentFilterInfo = {}

	// 字段类型图标
	filedTypeIconMap = dataFiledTypeIconMap

	//接收组
	get dragReceiver() {
		return {
			name: 'dragReceiver',
			put: (to: any, from: any, dragEl: HTMLElement) => {
				const curField = dragEl.getAttribute('field')
				const curCategory = dragEl.getAttribute('category')
				const isRepeat = this.addedFilterList.some(item => {
					return (
						item['field'] === curField &&
						item['category'] === curCategory
					)
				})
				return !isRepeat
			},
		}
	}

	// 数据格式配置
	get dataConfigs() {
		return this.$attrs.componentData['dataConfigs']
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
	onFilter() {
		this.updateConfigData()
	}
	// 删除项
	onDeleteItem(info: {}) {
		this.addedFilterList = this.addedFilterList.filter(item => {
			return item['field'] !== info['field']
		})
		this.updateConfigData()
	}

	// 更新数据配置
	updateConfigData() {
		this.dataConfigs['filters'] = this.addedFilterList.map(
			item => item['field']
		)
	}

	onFilterSettings(info: {}) {
		this.isShowFilterModal = true
		this.currentFilterInfo = info
	}
}
</script>

<style></style>
