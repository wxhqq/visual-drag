<template>
	<div class="added-list-wrap" @contextmenu="handleContextMenu">
		<div class="mb-8px">
			<i
				@click="triggerExpand"
				class="icon bl-icon-action"
				title="展开 / 折叠所有图层"></i>
		</div>
		<ComLayer :componentList.sync="allSortComponents" />
	</div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue, Watch } from 'vue-property-decorator'
import VisualScreenStore, {
	ScreenComponent,
} from '@store/modules/visual-screen'
import ComLayer from './components/ComLayer.vue'
import { traverseComponent } from './scripts/utils'

// 已添加的组件清单组件

@Component({
	components: { ComLayer },
})
export default class AddedComponentsList extends Vue {
	// 所有添加的组件排序
	@ProvideReactive() allSortComponents: ScreenComponent[] = []

	get allAddedComponents() {
		return VisualScreenStore.allAddedComponents
	}

	// 是否全部展开
	isAllExpaned = true

	@Watch('allAddedComponents', { immediate: true })
	onChange() {
		this.allSortComponents = this.allAddedComponents
	}

	// 全部展开或收起
	triggerExpand() {
		this.isAllExpaned = !this.isAllExpaned
		traverseComponent(this.allSortComponents, item => {
			item.expanded = this.isAllExpaned
		})
	}

	// 右击菜单
	handleContextMenu(e: PointerEvent) {
		e.stopPropagation()
		e.preventDefault()

		if (!VisualScreenStore.activeComponent.component) return
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
}
</script>

<style lang="scss" scoped>
.added-list-wrap {
	position: relative;
	padding: 10px 16px 16px;
	overflow: hidden;
	@include hide-scroll-bar();
}
</style>
