<template>
	<div class="dashboard-editor" :style="editorStyle" id="dashboardEditor">
		<header class="editor-header">
			<Input
				v-show="isShowTitleEdit"
				ref="titleInputRef"
				class="bi-title"
				:maxlength="32"
				v-model="themeOptions.title"
				@on-blur="onEditTitle"
				@on-enter="onEditTitle" />
			<div
				class="bi-title"
				v-show="!isShowTitleEdit"
				@dblclick="editTitle">
				{{ themeOptions.title }}
			</div>
		</header>
		<!-- 故事线 导航 -->
		<StoryLine :allComponents="allAddedComponents" />
		<main class="bi-grid-container">
			<!-- 布局指示器 -->
			<BiIndicator
				:style="{ display: showIndicator ? 'grid' : 'none' }" />
			<grid-layout
				ref="gridlayoutRef"
				:style="{
					'margin-left': `${-themeOptions.cardGap}px`,
					'margin-right': `${-themeOptions.cardGap}px`,
				}"
				:layout.sync="allAddedComponents"
				:col-num="12"
				:row-height="30"
				:margin="[themeOptions.cardGap, themeOptions.cardGap]"
				:use-css-transforms="true"
				@layout-updated="showIndicator = false">
				<grid-item
					v-for="item in allAddedComponents"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:key="item.i"
					@resize="beforeDragResize"
					@move="beforeDragResize"
					@resized="updateRecord"
					@moved="updateRecord"
					class="bi-grid-item">
					<BiCard :nodeInfos="item" v-if="item.component">
						<component
							:is="item.component"
							:node-info="item"
							:skin="themeOptions.skin"></component>
					</BiCard>
				</grid-item>
			</grid-layout>
		</main>
	</div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'

import draggable from 'vuedraggable'
import BiIndicator from './components/Indicator.vue'
import BiCard from './components/BiCard.vue'
import StoryLine from './components/StoryLine.vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
// 自动注册
import { VisualComponentList } from '../../screen-edit/scripts/auto-register-component'

import { generateGuid } from '../../screen-edit/scripts/utils'
// 组件
let dragPos = { x: 0, y: 0 }

@Component({
	components: {
		draggable,
		BiIndicator,
		BiCard,
		StoryLine,
		GridLayout,
		GridItem,
		...VisualComponentList,
	},
})
export default class OcDashboardEditor extends Vue {
	@Ref('gridlayoutRef') gridlayoutRef: any
	@Ref('titleInputRef') titleInputRef: any

	showIndicator = false //展示指示器

	// 修改title
	isShowTitleEdit = false

	// 画布中所有添加的组件
	get allAddedComponents() {
		return VisualDashboardStore.allAddedComponents
	}
	// 页面样式配置
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}

	// 编辑页面
	get editorStyle() {
		const { backgroundColor, backgroundImg } = this.themeOptions
		return {
			backgroundColor,
			backgroundImage: backgroundImg
				? `url(${require(`@assets/custom-visual/dashboard/theme-bg-${backgroundImg}.jpg`)})`
				: '',
		}
	}

	// 拖拽添加参数
	get dragAddInfos() {
		return VisualDashboardStore.dragAddInfos
	}

	// grid容器边距
	editorRect = { left: 0, top: 0, right: 0, bottom: 0 }

	// 拖拽添加组件
	@Watch('dragAddInfos', { deep: true })
	onDragAddComponent() {
		const { mouseX, mouseY, isDragging } = this.dragAddInfos
		const { left, top, right, bottom } = this.editorRect

		// 拖拽是否在grid容器内
		const mouseInGrid =
			mouseX > left && mouseX < right && mouseY > top && mouseY < bottom

		// 被拖拽的临时组件
		if (isDragging) {
			// 拖拽中

			// 存在临时组件
			const hasTempCom = this.allAddedComponents.some(
				item => item.i === 'drop'
			)
			if (mouseInGrid && !hasTempCom) {
				const { length } = this.allAddedComponents
				const tempData = {
					x: (length * 2) % 12,
					y: length + 12,
					w: 4,
					h: 8,
					i: 'drop',
					guid: 'drop',
				} as BiComponent

				VisualDashboardStore.addNewComponent({
					data: tempData,
				})
			}
			const index = this.allAddedComponents.findIndex(
				item => item.i === 'drop'
			)

			if (index === -1) return
			const el = this.gridlayoutRef.$children[index]
			el.dragging = {
				top: mouseY - top,
				left: mouseX - left,
			}
			dragPos = el.calcXY(mouseY - top, mouseX - left)

			if (mouseInGrid) {
				this.dragEvent('dragstart')
			} else {
				this.dragEvent('dragend')
				VisualDashboardStore.deleteComponent('drop')
			}
		} else {
			// 拖拽结束
			if (mouseInGrid) {
				this.dragEvent('dragend')
				VisualDashboardStore.deleteComponent('drop')
				const guid = generateGuid()
				const data = {
					...JSON.parse(JSON.stringify(this.dragAddInfos.nodeInfo)),
					x: dragPos.x,
					y: dragPos.y,
					w: 4,
					h: 8,
					i: guid,
					guid: guid,
				} as BiComponent
				VisualDashboardStore.addNewComponent({ data })
				VisualDashboardRollback.pushRecord()
			}
		}
	}

	mounted() {
		// 缓存容器边距
		const gridContainer = document.querySelector('.bi-grid-container')
		if (gridContainer) {
			const { left, top, right, bottom } =
				gridContainer.getBoundingClientRect()
			this.editorRect = { left, top, right, bottom }
		}
	}

	// 添加组件时手动触发拖拽事件
	dragEvent(type: 'dragstart' | 'dragend') {
		this.gridlayoutRef.dragEvent(type, 'drop', dragPos.x, dragPos.y, 8, 4)
	}

	// 编辑dashboard title
	editTitle() {
		this.isShowTitleEdit = true
		this.$nextTick(() => {
			this.titleInputRef.focus({
				cursor: 'end',
			})
		})
	}

	// 开始拖拽 或缩放前
	beforeDragResize() {
		this.showIndicator = true
	}

	// 记录更新
	updateRecord() {
		VisualDashboardRollback.pushRecord()
	}

	// 修改仪表盘名称后
	onEditTitle() {
		this.isShowTitleEdit = false
		this.updateRecord()
	}
}
</script>

<style lang="scss" scoped>
.dashboard-editor {
	position: relative;
	min-height: 100%;
	padding: 20px 16px;
	display: flex;
	flex-direction: column;
	background: {
		repeat-x: no-repeat;
		size: 100% auto;
	}
}
.editor-header {
	// @include height-lh(28px);
	// 标题
	.bi-title {
		@include height-lh(32px);
		font-weight: bold;
		font-size: 24px;
		@include set-skin() {
			color: get-bg-changed-variable('color-text-crucial');
		}
	}
	::v-deep .ivu-input {
		font-size: 24px;
		font-weight: bold;
		padding: 0;
		background: transparent;
		border: none;
		@include set-skin() {
			color: get-bg-changed-variable('color-text-crucial');
		}
		&:focus {
			box-shadow: none;
		}
	}
}
// 网格布局
.bi-grid-container {
	padding: 8px 0;
	flex: 1;
	position: relative;
}
.bi-grid-item {
	touch-action: none;
}

::v-deep .vue-grid-item.vue-grid-placeholder {
	background: blue;
}
</style>
