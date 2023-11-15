<template>
	<ul class="drag-list">
		<draggable
			v-model="curSortList"
			animation="400"
			:swapThreshold="0.65"
			:group="group"
			:move="onMove"
			:disabled="!!editlabelId"
			@choose="onChoose"
			@end="onEnd">
			<li
				v-for="(item, index) in curSortList"
				:key="item.guid"
				:nodeIndex="index">
				<div
					class="added-comp-item flex-justify-between"
					:class="{
						actived:
							activeComponent.guid === item.guid ||
							allComponentGuidInArea.includes(item.guid),
					}"
					@mousedown="onActiveComponent($event, item)">
					<div class="flex-justify-start row-item-wrap">
						<span
							class="collapse-icon"
							:class="{ close: !item.expanded }">
							<i
								class="icon bl-icon-arrow-down"
								@click.stop.prevent="
									item.expanded = !item.expanded
								"
								v-if="
									item.component === 'Vgroup' &&
									item.children.length
								" />
						</span>
						<i
							:class="componentIconMap[item.component]"
							class="mr-4px"></i>
						<Input
							v-if="editlabelId && editlabelId === item.guid"
							v-model="editlabel"
							size="small"
							v-focus="editlabelId === item.guid"
							@on-blur="onSaveLabel(item)" />
						<p
							v-else
							@dblclick.stop.prevent="onDblClickComponent(item)">
							{{ item.label }}
						</p>
					</div>
					<!-- 锁定图标 -->
					<span class="attr-icons">
						<i
							v-show="item.isLock"
							:class="
								item.isLock
									? 'bl-icon-unlock2'
									: 'bl-icon-lock2'
							"
							@click="handleLock(!item.isLock)"></i>
						<i
							v-show="!item.isShow"
							:class="
								item.isShow ? 'bl-icon-hide' : 'bl-icon-unhide'
							"
							@click="handleShow(!item.isShow)"></i>
					</span>
				</div>
				<ComLayer
					v-show="item.expanded"
					v-if="item.component === 'Vgroup'"
					:component-list.sync="item.children" />
			</li>
		</draggable>
	</ul>
</template>

<script lang="ts">
import {
	Component,
	InjectReactive,
	PropSync,
	Vue,
} from 'vue-property-decorator'
import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import draggable, { MoveEvent } from 'vuedraggable'
import {
	afterEndDragComponentList,
	calcSelectAreaStyle,
} from '../scripts/calculate-util'
import {
	getComponentCanvasPos,
	getComponentChildrenLayers,
} from '../scripts/utils'

import { componentIconMap } from '../scripts/constants'

import VisualScreenRollback from '@store/modules/visual-screen-rollback'
// 迭代图层组件

@Component({
	components: { draggable },
	directives: {
		focus(el, { value }) {
			setTimeout(() => {
				value && el.getElementsByTagName('input')[0].focus()
			}, 600)
		},
	},
})
export default class ComLayer extends Vue {
	@PropSync('componentList') curSortList: ScreenComponent[]

	componentIconMap = componentIconMap

	// 多选组件
	get areaComponents() {
		return VisualScreenStore.selectedDatas.areaComponents
	}

	// 编辑label
	editlabelId = ''
	editlabel = ''

	curComponentCanvasPos = { left: 0, top: 0 }
	// 框选区的所有组件
	get allComponentGuidInArea() {
		return VisualScreenStore.selectedDatas.areaComponents.map(
			item => item.guid
		)
	}

	get group() {
		const component = this.curSortList[0]
		return {
			name: component?.pGuid ? 'parent' : 'sub',
			put: true, //允许拖出
			pull: true,
		}
	}

	@InjectReactive() allSortComponents: ScreenComponent[]

	get activeComponent() {
		return VisualScreenStore.activeComponent
	}

	// 选中组件
	onActiveComponent(
		event: MouseEvent | MoveEvent<ScreenComponent>,
		item: ScreenComponent
	) {
		if (!VisualScreenStore.holdCtrl) {
			VisualScreenStore.updateData({
				key: 'activeComponent',
				data: item,
			})

			event['button'] === 0 && VisualScreenStore.hideSelectArea()
			return
		}
		// if (item.component === 'Vgroup') return

		const index = this.areaComponents.findIndex(
			ele => ele.guid === item.guid
		)
		// 多选时， 点击两次则取消选择
		if (index > -1) {
			VisualScreenStore.resetActiveComponent()

			this.areaComponents.splice(index, 1)
		} else {
			VisualScreenStore.updateData({
				key: 'activeComponent',
				data: item,
			})
			this.areaComponents.push(item)
		}

		VisualScreenStore.updateSelectDates({
			isShow: true,
			areaStyle: calcSelectAreaStyle(this.areaComponents),
			areaComponents: this.areaComponents,
		})
	}
	// 双击组件， 修改label名称
	onDblClickComponent(node: ScreenComponent) {
		this.editlabelId = node.guid
		this.editlabel = node.label
	}
	// 修改label
	onSaveLabel() {
		VisualScreenStore.setComponentLabel(
			this.editlabel || this.activeComponent.label
		)
		this.editlabelId = ''
		this.editlabel = ''
	}
	// 组件解锁锁定
	handleLock(isLock: boolean) {
		VisualScreenStore.setComponentAttr({
			isLock,
		})
	}
	// 组件解锁锁定
	handleShow(isShow: boolean) {
		VisualScreenStore.setComponentAttr({
			isShow,
		})
	}

	// 选择拖拽组件时
	onChoose() {
		// 计算当前拖拽组件的相对于画布的位置
		this.curComponentCanvasPos = getComponentCanvasPos(this.activeComponent)
	}
	// 选择拖拽的组件
	onMove(e: MoveEvent<ScreenComponent>) {
		const { element: curNode } = e.draggedContext
		const { element: tagetNode } = e.relatedContext
		this.onActiveComponent(e, curNode)

		// 获取当前元素存在几代子孙
		const curChildrenLayers = getComponentChildrenLayers()

		//已经存在两代 不允许拖拽到其他group
		if (curChildrenLayers === 2) {
			return false
		}
		// 已经存在1代， 且目标节点处于第三级 不允许拖拽
		if (curChildrenLayers == 1 && tagetNode.level.split('-').length === 3) {
			return false
		}
		return true
	}
	// 拖拽结束 更新数据
	onEnd() {
		afterEndDragComponentList(
			this.activeComponent,
			this.allSortComponents,
			this.curComponentCanvasPos
		)
		VisualScreenRollback.pushRecord()
	}
}
</script>

<style lang="scss" scoped>
.drag-list {
	overflow: hidden;
	color: $color-white-45;
	font-size: 12px;
	li li > .added-comp-item {
		padding-left: 16px;
	}
	li li li > .added-comp-item {
		padding-left: 32px;
	}
}
.row-item-wrap {
	flex: 1;
	align-items: center;
	overflow: hidden;
	& > p {
		@include ellipsis();
	}
}
.collapse-icon {
	display: inline-block;
	@include size(20px);
	transition: all 0.3s;
	line-height: 20px;
	text-align: center;
	flex-shrink: 0;
	&.close {
		transform: rotate(-90deg);
	}
}
.added-comp-item {
	@include height-lh(28px);
	padding-right: 2px;
	border-radius: 4px;
	transition: all 0.3s;
	.attr-icons {
		display: inline-block;
		min-width: 36px;
		position: relative;
		i {
			position: absolute;
		}
		i:last-child {
			position: absolute;
			right: 0;
		}
	}
	&:hover {
		background: #1f1f1f;
		color: $color-white-100;
		.attr-icons i {
			cursor: pointer;
			display: inline !important;
		}
	}
	&.actived {
		color: $color-white-100;
		@include set-theme {
			background-color: get-themed-variable('color-theme-primary');
		}
	}
	&.hidden {
		color: $color-white-25;
	}
}
</style>
