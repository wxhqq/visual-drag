<template>
	<ul
		class="contex-menu"
		v-show="contextInfo.isShow"
		:style="contextInfo.style">
		<li v-for="menu in menuList" :key="menu.label" v-show="!menu.isHidden">
			<div
				class="menu-item flex-justify-between"
				@click.stop.prevent="onMenuClick(menu.clickMethod)">
				<div>
					<i :class="menu.icon"></i>
					<span class="ml-8px">{{ menu.label }}</span>
				</div>
				<i v-show="menu.children" class="bl-icon-arrow-right ml-2"></i>
			</div>
			<ul v-if="menu.children" class="sub-menu-list">
				<li
					v-for="sub in menu.children"
					:key="sub.label"
					@click.stop.prevent="onMenuClick(sub.clickMethod)">
					<div class="menu-item">
						<i :class="sub.icon"></i>
						<span class="ml-8px">{{ sub.label }}</span>
					</div>
				</li>
			</ul>
		</li>
	</ul>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import VisualScreenRollback from '@store/modules/visual-screen-rollback'

import { deepClone } from '@/scripts/utils'
import {
	findComponent,
	findComponentIndex,
	generateGuid,
	getComponentChildrenLayers,
	traverseComponent,
} from '../scripts/utils'
import { composeSingleComponent, deComposeComponent } from '../scripts/compose'
// 右击菜单

@Component
export default class ContextMenu extends Vue {
	// 菜单信息
	get contextInfo() {
		const { isShow, ...style } = VisualScreenStore.contextInfo
		return {
			isShow,
			style,
		}
	}

	// 获取当前元素存在几代子孙
	get curChildrenLayers() {
		return getComponentChildrenLayers()
	}

	//选中信息
	get selectAreaInfos() {
		return VisualScreenStore.selectedDatas
	}

	get activeComponent() {
		return VisualScreenStore.activeComponent
	}

	// 组件菜单
	get menuList() {
		const { component, isLock, isShow, level } = this.activeComponent
		const levelArr = level.split('-')
		const selectShow = this.selectAreaInfos.isShow

		return [
			{
				label: '图层排序',
				icon: 'bl-icon-delete',
				isHidden: selectShow,
				children: [
					{
						label: '置顶',
						icon: 'bl-icon-delete',
						clickMethod: () => {
							this.changeLayer(Infinity)
						},
					},
					{
						label: '置底',
						icon: 'bl-icon-delete',
						clickMethod: () => {
							this.changeLayer(0)
						},
					},
					{
						label: '上移一层',
						icon: 'bl-icon-delete',
						clickMethod: () => {
							this.changeLayer(1)
						},
					},
					{
						label: '下移一层',
						icon: 'bl-icon-delete',
						clickMethod: () => {
							this.changeLayer(-1)
						},
					},
				],
			},
			{
				label: '解散组合',
				icon: 'bl-icon-delete',
				isHidden: component !== 'Vgroup' || selectShow,
				clickMethod: deComposeComponent,
			},
			{
				label: '成组',
				icon: 'bl-icon-delete',
				isHidden:
					levelArr.length + this.curChildrenLayers >= 3 || selectShow,
				clickMethod: composeSingleComponent,
			},
			{
				label: '锁定',
				icon: 'bl-icon-unlock2',
				isHidden: !selectShow && isLock,
				clickMethod: () => {
					this.lockComponent(true)
				},
			},
			{
				label: '解锁',
				isHidden: !selectShow && !isLock,
				icon: 'bl-icon-lock2',
				clickMethod: () => {
					this.lockComponent(false)
				},
			},
			{
				label: '隐藏',
				icon: 'bl-icon-unhide',
				isHidden: !selectShow && !isShow,
				clickMethod: () => {
					this.hideComponent(false)
				},
			},
			{
				label: '显示',
				isHidden: !selectShow && isShow,
				icon: 'bl-icon-hide',
				clickMethod: () => {
					this.hideComponent(true)
				},
			},
			{
				label: '删除',
				icon: 'bl-icon-delete',
				clickMethod: this.delComponent,
			},
			{
				label: '复制',
				icon: 'ivu-icon ivu-icon-md-copy',
				clickMethod: this.copyComponent,
				isHidden: selectShow,
			},
		]
	}
	// 层级排序
	changeLayer(moveIndex: number) {
		const { pGuid, guid } = this.activeComponent
		const list =
			findComponent(pGuid)?.children ||
			VisualScreenStore.allAddedComponents

		const curIndex = findComponentIndex(guid)

		if (list.length) {
			const newIndex = moveIndex
				? Math.min(curIndex + moveIndex, list.length - 1)
				: 0
			list.splice(newIndex, 0, ...list.splice(curIndex, 1))
		}
		VisualScreenRollback.pushRecord()
	}

	// 删除组件
	delComponent() {
		if (this.selectAreaInfos.isShow) {
			this.selectAreaInfos.areaComponents.forEach(item => {
				VisualScreenStore.deleteComponent(item.guid)
			})
		} else {
			const { guid } = VisualScreenStore.activeComponent
			VisualScreenStore.deleteComponent(guid)
		}
		VisualScreenRollback.pushRecord()
	}
	// 组件解锁锁定
	lockComponent(isLock: boolean) {
		const data = { isLock }
		if (this.selectAreaInfos.isShow) {
			const guidList = this.selectAreaInfos.areaComponents.map(
				item => item.guid
			)
			VisualScreenStore.batchSetComponentAttr({ guidList, data })
		} else {
			VisualScreenStore.setComponentAttr(data)
		}
	}
	// 组件解锁锁定
	hideComponent(isShow: boolean) {
		const data = { isShow }
		if (this.selectAreaInfos.isShow) {
			const guidList = this.selectAreaInfos.areaComponents.map(
				item => item.guid
			)
			VisualScreenStore.batchSetComponentAttr({ guidList, data })
		} else {
			VisualScreenStore.setComponentAttr(data)
		}
	}
	// 复制组件
	copyComponent() {
		const data = deepClone(this.activeComponent) as ScreenComponent

		data.guid = generateGuid()
		if (data.children) {
			traverseComponent(
				data.children,
				(item, pGuid) => {
					item.guid = generateGuid()
					pGuid && (item.pGuid = pGuid)
				},
				data.guid
			)
		}

		const { guid, pGuid } = this.activeComponent
		const insertindex = findComponentIndex(guid)

		VisualScreenStore.addNewComponent({
			data,
			index: insertindex,
			tagetList: pGuid ? findComponent(pGuid)?.children : undefined,
		})
		VisualScreenRollback.pushRecord()
	}
	// 点击按钮
	onMenuClick(callback: () => void) {
		if (callback) {
			callback()

			// 隐藏菜单
			VisualScreenStore.updateData({
				key: 'contextInfo',
				data: { isShow: false, top: '0', left: '0' },
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.contex-menu {
	position: fixed;
	top: 200px;
	left: 500px;
	border: 1px solid $color-grey-96;
	li {
		position: relative;
		&:hover {
			.sub-menu-list {
				display: block;
			}
		}
	}
	.sub-menu-list {
		position: absolute;
		right: -100px;
		top: 0;
		display: none;
	}
	.menu-item {
		padding: 0 10px;
		@include height-lh(32px);
		background-color: $color-grey-88;
		cursor: pointer;
		&:hover {
			@include set-theme {
				background-color: get-themed-variable('color-theme-primary');
			}
		}
	}
}
</style>
