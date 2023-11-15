<template>
	<div class="dashboard-page">
		<ToolBar />
		<main class="layout-main" :class="`${themeOptions.skin}-scroll-bar`">
			<DataPanel :rightTabName="activeRightTab" />
			<main class="content-wrap" :class="themeOptions.skin">
				<OcDashboardEditor />
			</main>
			<aside class="right-side dark">
				<Tabs
					v-show="activeComponent.component"
					v-model="activeRightTab">
					<TabPane label="属性" name="attrs" class="hide-scroll-bar">
						<CommonAttrs page="dashboard" />
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
				<BiPageAttr v-show="!activeComponent.component" />
			</aside>
		</main>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import OcDashboardEditor from './BiEditor.vue'
import ToolBar from './ToolBar.vue'
import BiPageAttr from './components/BiPageAttr.vue'
import DataPanel from '../../screen-edit/data-panel/DataPanel.vue'
import DataRelated from '../../screen-edit/data-panel/DataRelated.vue'
import {
	VisualAttrsList,
	VisualDataSettingsList,
} from '../../screen-edit/scripts/auto-register-component'
import CommonAttrs from './components/CommonAttrs.vue'

import VisualDashboardStore, {
	BiComponent,
} from '@store/modules/visual-dashboard'
import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'
// 组件

@Component({
	components: {
		OcDashboardEditor,
		ToolBar,
		BiPageAttr,
		DataPanel,
		DataRelated,
		CommonAttrs,
		...VisualAttrsList,
		...VisualDataSettingsList,
	},
})
export default class OcDashboardEdit extends Vue {
	// 存在数据关联的组件
	hasDataRelatedList = Object.keys(VisualDataSettingsList).map(item => {
		return item.replace('DataSettings', '')
	})
	// 激活的tab按钮
	activeRightTab = 'attrs'

	get activeComponent() {
		return VisualDashboardStore.activeComponent
	}
	// 页面样式
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}
	// 激活组件的样式或属性发生变化时记录
	get componentAttrs() {
		const { attrStyle, guid, label, wrapStyle } = this.activeComponent
		return {
			guid,
			label,
			wrapStyle,
			attrStyle,
		}
	}
	// 激活组件的样式或属性发生变化时记录
	@Watch('componentAttrs', { deep: true })
	onActiveComponentChange(old: BiComponent, val: BiComponent) {
		if (val.guid && val.guid === old.guid) {
			VisualDashboardRollback.pushRecord()
		} else {
			this.activeRightTab = 'attrs'
		}
	}

	mounted() {
		// 数据获取后推入首次记录
		VisualDashboardRollback.pushRecord()
	}
}
</script>

<style lang="scss" scoped>
.dashboard-page {
	.layout-main {
		position: relative;
		display: grid;
		grid-template-columns: auto 300px;
		height: calc(100vh - 64px);
	}
	.right-side {
		height: 100%;
		overflow: hidden;
		background-color: $color-grey-92;
		border-left: 1px solid $color-grey-75;
		border-top: 1px solid $color-grey-75;
	}

	.content-wrap {
		height: 100%;
		width: calc(100% - 30px);
		overflow-y: auto;
		overflow-x: hidden;
		@include set-skin() {
			color: get-bg-changed-variable('color-text-primary');
		}
	}
}
.content-wrap {
	::v-deep .vue-resizable-handle {
		background: none;
		&::after {
			content: '';
			display: inline-block;
			position: absolute;
			@include size(10px);
			right: 6px;
			bottom: 6px;
			border-right: 2px solid $color-grey-25;
			border-bottom: 2px solid $color-grey-25;
		}
	}
	&.dark {
		::v-deep .vue-resizable-handle::after {
			border-right: 2px solid $color-grey-65;
			border-bottom: 2px solid $color-grey-65;
		}
	}
}
.attr-form-wrap {
	padding: 0 16px;
}
::v-deep .visual-screen-hr {
	border-color: $color-grey-75;
}

::v-deep .ivu-tabs {
	height: 100%;
	.ivu-tabs-content {
		height: calc(100% - 36px);
	}
	.ivu-tabs-tabpane {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
}
::v-deep .ivu-tabs-nav-scroll {
	@include flex-justify(center);
}
</style>
