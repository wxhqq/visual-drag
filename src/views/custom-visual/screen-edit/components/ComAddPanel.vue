<template>
	<Dropdown
		placement="bottom-start"
		stop-propagation
		trigger="custom"
		:visible="isShowComponentPannel"
		@on-clickoutside="onClickOutside">
		<div @click="isShowComponentPannel = !isShowComponentPannel">
			<slot></slot>
		</div>

		<DropdownMenu slot="list" class="mt-8px">
			<div
				v-for="(item, index) in componentData"
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
								@dragend="onComponentDragend(component, $event)"
								@click="onAddComponent(component)"
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import { generateGuid, getComponentCanvasPos } from '../scripts/utils'
import VisualScreenRollback from '@store/modules/visual-screen-rollback'
import { computedNodePos } from '../scripts/calculate-util'
// 可拖拽组件列表

@Component
export default class OcComAddPanel extends Vue {
	@Prop() componentData: ScreenComponent[]

	// 是否打开添加面板
	isShowComponentPannel = false

	get activeComponent() {
		return VisualScreenStore.activeComponent
	}

	mounted() {
		const dragOverEvent = (e: DragEvent) => {
			e.preventDefault()
			if (e.dataTransfer?.dropEffect) {
				e.dataTransfer.dropEffect = 'move'
			}
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
	onAddComponent(nodeInfo: ScreenComponent) {
		const position = {}
		if (this.activeComponent.component !== 'Vgroup') {
			const { width, height } = nodeInfo.propStyle
			Object.assign(position, {
				left: 1920 / 2 - width / 2,
				top: 1080 / 2 - height / 2,
			})
		}

		this.addNewComponent(nodeInfo, position)
	}

	// 组件拖拽结束
	onComponentDragend(nodeInfo: ScreenComponent, $event: DragEvent) {
		this.isShowComponentPannel = false

		const canvasContainer = document.getElementById(
			'visiualEditorContainer'
		)
		if (!canvasContainer) return

		const position = computedNodePos(canvasContainer, $event)
		if (!position) return
		// 相对于组合做偏移
		if (this.activeComponent.component === 'Vgroup') {
			const groupPos = getComponentCanvasPos(this.activeComponent)
			position.left -= groupPos.left
			position.top -= groupPos.top
		}

		// 相对于自己做偏移
		position.left -= 80

		this.addNewComponent(nodeInfo, position)
	}

	// 添加新组建
	addNewComponent(
		nodeInfo: ScreenComponent,
		position: { left?: number; top?: number }
	) {
		const { component, children, guid } = this.activeComponent
		const newNode = JSON.parse(
			JSON.stringify({
				...nodeInfo,
				isLock: false,
				isShow: true, //默认显示
				level: '',
				expanded: true,
				pGuid: component === 'Vgroup' ? guid : '',
				guid: generateGuid(),
			})
		)

		Object.assign(newNode.propStyle, position)
		// 判断添加进的组合
		VisualScreenStore.addNewComponent({
			data: newNode,
			tagetList: component === 'Vgroup' ? children : undefined,
		})
		VisualScreenRollback.pushRecord()
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
