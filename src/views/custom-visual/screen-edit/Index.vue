<template>
	<div class="screen-edit-page dark dark-scroll-bar" v-on-resize="onResize">
		<div class="layout" @mousedown="hideContextMenu">
			<DataPanel :rightTabName="activeRightTab" />
			<!-- 工具栏 -->
			<ToolBar />
			<main>
				<section class="left">
					<AddedComponentsList />
				</section>
				<div
					class="center center-container"
					ref="centerRef"
					:style="{ cursor: holdSpace ? 'grabbing' : 'default' }"
					@mousedown="onDragMoveCanvas"
					@contextmenu="handleContextMenu">
					<div class="center-wrap">
						<Editor
							v-show="this.isPageLoading"
							:style="{ transform: `scale(${canvasScale})` }" />
						<!-- 画布尺寸说明 -->
						<p class="cavas-size-info">
							<span>按住空格可拖动画布</span>
							<span class="ml-12px">1920 * 1080</span>
						</p>
					</div>
				</div>
				<section class="right">
					<AlignMenu />
					<Tabs
						v-show="activeComponent.component"
						v-model="activeRightTab">
						<TabPane
							label="属性"
							name="attrs"
							class="hide-scroll-bar">
							<CommonAttrs />
							<component
								v-if="activeComponent.component"
								:is="`${activeComponent.component}Attr`"
								:attrStyle="activeComponent.attrStyle" />
						</TabPane>
						<TabPane
							v-if="
								hasDataRelatedList.includes(
									activeComponent.component
								)
							"
							label="数据联动"
							name="data"
							class="hide-scroll-bar">
							<DataRelated :componentData="activeComponent">
								<component
									v-if="activeComponent.component"
									:is="`${activeComponent.component}DataSettings`"
									:componentData="activeComponent" />
							</DataRelated>
						</TabPane>
					</Tabs>
					<CanvasAttrs v-show="!activeComponent.component" />
				</section>
			</main>
		</div>
		<ContextMenu />
	</div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'

// 组件
import ToolBar from './ToolBar.vue'
import AddedComponentsList from './AddedComponentsList.vue'
import Editor from './Editor.vue'
import CanvasAttrs from './components/CanvasAttrs.vue'
import ContextMenu from './components/ContextMenu.vue'
import AlignMenu from './components/AlignMenu.vue'
import CommonAttrs from './components/CommonAttrs.vue'
import DataPanel from './data-panel/DataPanel.vue'
import DataRelated from './data-panel/DataRelated.vue'
import {
	VisualAttrsList,
	VisualDataSettingsList,
} from './scripts/auto-register-component'

// store
import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import VisualScreenRollback from '@store/modules/visual-screen-rollback'
import { initCanvasSize, refreshComponentStyle } from './scripts/calculate-util'
import testData from './test-data'

@Component({
	components: {
		ToolBar,
		AddedComponentsList,
		Editor,
		CanvasAttrs,
		ContextMenu,
		AlignMenu,
		CommonAttrs,
		DataPanel,
		DataRelated,
		...VisualAttrsList,
		...VisualDataSettingsList,
	},
})
export default class VisualIndex extends Vue {
	@Ref('centerRef') centerRef: HTMLElement
	// 存在数据关联的组件
	hasDataRelatedList = Object.keys(VisualDataSettingsList).map(item => {
		return item.replace('DataSettings', '')
	})

	// 页面是否加载完成
	isPageLoading = false
	activeRightTab = 'attrs'

	// 画布的缩放比例
	get canvasScale() {
		return `${Math.round(VisualScreenStore.canvasScale * 100)}%`
	}
	get activeComponent() {
		return VisualScreenStore.activeComponent
	}
	// 是否按了空格
	get holdSpace() {
		return VisualScreenStore.holdSpace
	}

	//选中信息
	get selectAreaInfos() {
		return VisualScreenStore.selectedDatas
	}

	// 除了位置和大小之外（位置和大小缓存加防抖）
	get updateRecordAttrs() {
		const { propStyle, ...others } = this.activeComponent
		return others
	}

	// 更新属性 缓存
	@Watch('updateRecordAttrs', { deep: true })
	onActiveComponentAttrChange(old: ScreenComponent, val: ScreenComponent) {
		if (val.guid && val.guid === old.guid) {
			VisualScreenRollback.pushRecord()
		} else {
			this.activeRightTab = 'attrs'
		}
	}

	beforeCreate() {
		VisualScreenStore.updateData({
			key: 'allAddedComponents',
			data: testData,
		})
	}
	mounted() {
		this.initKeyDownListener()

		// 数据获取后推入首次记录
		VisualScreenRollback.pushRecord()
	}
	// 页面缩放
	onResize() {
		initCanvasSize()
		this.isPageLoading = true
	}
	// 右击菜单
	handleContextMenu(e: PointerEvent) {
		e.stopPropagation()
		e.preventDefault()

		if (!this.activeComponent.component) return
		// 展示菜单
		VisualScreenStore.updateData({
			key: 'contextInfo',
			data: {
				isShow: true,
				top: `${e.clientY}px`,
				left: `${e.clientX}px`,
			},
		})
	}
	// 拖拽移动画布
	onDragMoveCanvas(e: MouseEvent) {
		// 隐藏菜单
		this.hideContextMenu()

		if (!VisualScreenStore.holdSpace) return
		e.preventDefault()
		e.stopPropagation()
		const startScroll = {
			top: e.currentTarget?.['scrollTop'] || 0,
			left: e.currentTarget?.['scrollLeft'] || 0,
		}

		const move = (moveEvent: MouseEvent) => {
			const moveX = moveEvent.clientX - e.clientX
			const moveY = moveEvent.clientY - e.clientY

			this.centerRef.scrollTop = startScroll.top - moveY
			this.centerRef.scrollLeft = startScroll.left - moveX
		}

		const up = () => {
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mouseup', up)
		}

		document.addEventListener('mousemove', move)
		document.addEventListener('mouseup', up)
	}
	//键盘事件
	initKeyDownListener() {
		const keydownEvt = this.handleKeyEvent
		const keyup = () => {
			// 格式重置
			VisualScreenStore.updateData({
				key: 'holdSpace',
				data: false,
			})
			VisualScreenStore.updateData({
				key: 'holdCtrl',
				data: false,
			})
		}

		document.addEventListener('keydown', keydownEvt)
		document.addEventListener('keyup', keyup)

		this.$once('hook:beforeDestroy', () => {
			document.removeEventListener('keydown', keydownEvt)
			document.removeEventListener('keyup', keyup)
		})
	}
	/**
	 * 处理键盘按键事件
	 */
	handleKeyEvent(e: KeyboardEvent) {
		// 空格按钮
		VisualScreenStore.updateData({
			key: 'holdSpace',
			data: e.code == 'Space',
		})
		// ctrl按钮
		VisualScreenStore.updateData({
			key: 'holdCtrl',
			data: e.ctrlKey,
		})

		if (this.holdSpace) {
			e.preventDefault()
			return
		}
		switch (true) {
			case e.code === 'Delete': //删除
				if (this.selectAreaInfos.isShow) {
					this.selectAreaInfos.areaComponents.forEach(item => {
						VisualScreenStore.deleteComponent(item.guid)
					})
				} else {
					const { guid } = VisualScreenStore.activeComponent
					VisualScreenStore.deleteComponent(guid)
				}
				// 记录更新
				VisualScreenRollback.pushRecord()
				e.preventDefault()
				break
			case e.code === 'ArrowUp': //组件上移
				this.updateStyle(e, { offsetTop: e.shiftKey ? -10 : -1 })
				break
			case e.code === 'ArrowDown': //组件下移
				this.updateStyle(e, { offsetTop: e.shiftKey ? 10 : 1 })
				break
			case e.code === 'ArrowLeft': //组件左移
				this.updateStyle(e, { offsetLeft: e.shiftKey ? -10 : -1 })
				break
			case e.code === 'ArrowRight': //组件又移
				this.updateStyle(e, { offsetLeft: e.shiftKey ? 10 : 1 })
				break
			case e.ctrlKey && e.shiftKey && e.code === 'KeyZ': //重做
				VisualScreenRollback.redo()
				VisualScreenStore.hideSelectArea()
				break
			case e.ctrlKey && e.code === 'KeyZ': //撤销
				VisualScreenRollback.undo()
				VisualScreenStore.hideSelectArea()
				break
		}
	}
	/**
	 * 更新样式
	 */
	updateStyle(e: KeyboardEvent, { offsetLeft = 0, offsetTop = 0 }) {
		e.preventDefault()
		refreshComponentStyle({
			top: offsetTop,
			left: offsetLeft,
		})
	}

	/**
	 * 隐藏菜单
	 */
	hideContextMenu(e?: MouseEvent) {
		e?.stopPropagation()
		// 隐藏菜单
		if (VisualScreenStore.contextInfo.isShow) {
			VisualScreenStore.updateData({
				key: 'contextInfo',
				data: { isShow: false, top: '0', left: '0' },
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.screen-edit-page {
	width: 100vw;
	height: 100vh;
	min-width: 1200px;
	color: $color-white-65;
	background: #000;
}
main {
	display: grid;
	grid-template-columns: 240px calc(100% - 540px) 300px;
	height: calc(100vh - 64px);
}
.center {
	position: relative;
	overflow-y: auto;
	overflow-x: hidden;
	@include hide-scroll-bar();
	.cavas-size-info {
		position: fixed;
		bottom: 0;
		right: 330px;
	}
}
.center-wrap {
	position: absolute;
	// 画布最多放大两倍 上下左右空640px
	@include size(1920px * 2 + 1280px, 1080px * 2 + 1280px);
	padding: 640px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.left {
	background-color: $color-grey-92;
	overflow: hidden;
	border-right: 1px solid $color-grey-75;
	overflow-y: auto;
}
.right {
	background-color: $color-grey-92;
	overflow: hidden;
	border-left: 1px solid $color-grey-75;
}
::v-deep .attr-form-wrap {
	padding: 0 16px;
}
::v-deep .visual-screen-hr {
	border-color: $color-grey-75;
}

::v-deep .ivu-tabs {
	height: 100%;
	.ivu-tabs-content {
		height: calc(100% - 76px);
	}
	.ivu-tabs-tabpane {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
}

.visual-data-pannel {
	top: 64px;
	border-top: none;
}

::v-deep .ivu-tabs-nav-scroll {
	@include flex-justify(center);
}
</style>
