<template>
	<ul class="align-menu" :class="{ actived: subComponents.length > 1 }">
		<li
			v-for="(item, key) in menuList"
			:key="key"
			@click="handleAlign(key)">
			<i :class="item.icon" :title="item.title"></i>
		</li>
	</ul>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// store
import VisualScreenStore from '@store/modules/visual-screen'
import { calcSelectAreaStyle } from '../scripts/calculate-util'

import VisualScreenRollback from '@store/modules/visual-screen-rollback'
import { findComponent, getComponentCanvasPos } from '../scripts/utils'
// 对齐菜单  多选组件后出现

@Component
export default class AlignMenu extends Vue {
	// 对齐菜单
	menuList = {
		'align-left': {
			icon: 'bl-icon-align-left',
			title: '向左对齐',
		},
		'align-vertical': {
			icon: 'bl-icon-align-vertical',
			title: '垂直居中',
		},
		'align-right': {
			icon: 'bl-icon-align-right',
			title: '向右对齐',
		},
		'align-top': {
			icon: 'bl-icon-align-top',
			title: '向上对齐',
		},
		'align-horizontal': {
			icon: 'bl-icon-align-horizontal',
			title: '水平居中',
		},
		'align-bottom': {
			icon: 'bl-icon-align-bottom',
			title: '向下对齐',
		},
	}
	// 选择了组件
	get hasSelectArea() {
		return !!VisualScreenStore.selectedDatas.areaComponents.length
	}

	// 需要对齐的组件  要么为框选的组件 要么为组合中的子组件
	get subComponents() {
		if (this.hasSelectArea) {
			return VisualScreenStore.selectedDatas.areaComponents
		}
		return VisualScreenStore.activeComponent.children || []
	}

	// 样式
	get groupStyle() {
		if (this.hasSelectArea) {
			return VisualScreenStore.selectedDatas.areaStyle
		}
		return {
			...VisualScreenStore.activeComponent.propStyle,
			top: 0,
			left: 0,
		}
	}
	// 处理对齐
	handleAlign(alignName: string) {
		if (this.subComponents.length < 2) return
		const { width, height, top, left } = this.groupStyle

		this.subComponents.forEach(item => {
			const { propStyle } = item
			const style = {}
			console.log(1111)

			switch (alignName) {
				case 'align-left':
					style['left'] = left
					break
				case 'align-vertical':
					style['left'] = left + (width - propStyle.width) / 2
					break
				case 'align-right':
					style['left'] = left + width - propStyle.width
					break
				case 'align-top':
					style['top'] = top
					break
				case 'align-horizontal':
					style['top'] = top + (height - propStyle.height) / 2
					break
				case 'align-bottom':
					style['top'] = top + height - propStyle.height
					break
			}
			if (this.hasSelectArea) {
				const targetGroup = findComponent(item.pGuid)

				// 父容器的位置 要么为画布的位置0,0 要么为父组合的位置
				const parentPos = getComponentCanvasPos(targetGroup)

				style['top'] && (style['top'] -= parentPos.top)
				style['left'] && (style['left'] -= parentPos.left)
			}

			Object.assign(item.propStyle, style)
		})

		VisualScreenStore.updateSelectDates({
			areaStyle: calcSelectAreaStyle(this.subComponents),
		})
		VisualScreenRollback.pushRecord()
	}
}
</script>

<style lang="scss" scoped>
.align-menu {
	display: grid;
	grid-template-columns: repeat(8, auto);
	border-bottom: 1px solid $color-grey-75;
	height: 40px;
	padding: 0 24px;
	gap: 8px;
	align-items: center;
	color: $color-white-25;
	li {
		cursor: not-allowed;
	}
}
.actived {
	color: $color-white-65;
	li {
		cursor: pointer;
	}
}
</style>
