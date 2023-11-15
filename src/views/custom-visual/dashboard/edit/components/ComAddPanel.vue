<template>
	<div>
		<Dropdown
			placement="bottom-start"
			stop-propagation
			trigger="custom"
			:visible="isShowComponentPannel"
			@on-clickoutside="onClickOutside">
			<Button
				custom-icon="bl-icon-add"
				type="primary"
				@click="isShowComponentPannel = !isShowComponentPannel">
				添加图表
			</Button>
			<DropdownMenu slot="list">
				<div
					v-for="(item, index) in cahrtsComponentData"
					:key="index"
					class="add-menu-wrap">
					<div class="add-menu-title mb-4px font-bold">
						{{ item.title }}
					</div>
					<ul class="add-menu-list">
						<template v-for="(component, key) in item.components">
							<Tooltip
								:content="component.label"
								:key="key"
								transfer
								placement="top"
								theme="light">
								<li
									@dragend="onComponentDragend(component)"
									@click="addComponent(component)"
									:draggable="true"
									unselectable="on">
									<IconSymbol
										:icon="`#${component.icon}`"
										size="48" />
								</li>
							</Tooltip>
						</template>
					</ul>
				</div>
			</DropdownMenu>
		</Dropdown>
		<Button
			icon="ivu-icon ivu-icon-md-images"
			class="ml-8px"
			@dragend.native="onComponentDragend(imgComponent)"
			@click="addComponent(imgComponent)"
			:draggable="true"
			unselectable="on">
			添加图片
		</Button>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
import {
	ALL_COMPONENT_MAP,
	getChartsCompnents,
} from '../../../screen-edit/scripts/constants'
import { generateGuid } from '../../../screen-edit/scripts/utils'
import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'
// 可拖拽组件列表

@Component
export default class OcBiComAddPanel extends Vue {
	// 是否打开添加面板
	isShowComponentPannel = false

	// 图表组件
	cahrtsComponentData = getChartsCompnents('dashboard')

	imgComponent = ALL_COMPONENT_MAP.Vimg

	mounted() {
		const dragOverEvent = (e: DragEvent) => {
			e.preventDefault()
			if (e.dataTransfer?.dropEffect) {
				e.dataTransfer.dropEffect = 'move'
			}
			this.isShowComponentPannel &&
				Object.assign(VisualDashboardStore.dragAddInfos, {
					isDragging: true,
					mouseX: e.clientX,
					mouseY: e.clientY,
				})
		}
		document.addEventListener('dragover', dragOverEvent)

		this.$once('hook:beforeDestroy', () => {
			document.removeEventListener('dragover', dragOverEvent)
		})
	}
	// 点击外侧pannel隐藏
	onClickOutside() {
		this.isShowComponentPannel = false
	}
	// 点击添加组件
	addComponent(nodeInfo: BiComponent) {
		const guid = generateGuid()
		const { length } = VisualDashboardStore.allAddedComponents
		const tempData = {
			...JSON.parse(JSON.stringify(nodeInfo)),
			x: (length * 4) % 12,
			y: length + 12,
			w: 4,
			h: 8,
			i: guid,
			guid: guid,
		} as BiComponent

		VisualDashboardStore.addNewComponent({
			data: tempData,
		})
		VisualDashboardRollback.pushRecord()
	}

	// 组件拖拽结束
	onComponentDragend(node: BiComponent) {
		Object.assign(VisualDashboardStore.dragAddInfos, {
			isDragging: false,
			nodeInfo: node,
		})
	}
}
</script>

<style lang="scss" scoped>
.add-menu-wrap {
	padding: 12px;
	.add-menu-list {
		display: grid;
		grid-template-columns: repeat(4, 50px);
		gap: 24px;

		li {
			cursor: pointer;
			padding: 0 4px;
			border: 1px solid $color-grey-75;
			text-align: center;
			transform: all 0.3s;
			box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
			border-radius: 4px;
			&:hover {
				@include set-theme {
					border-color: get-themed-variable('color-theme-primary');
				}
			}
		}
	}
}
</style>
