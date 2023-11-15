<template>
	<div class="card-menu-btn-wrap">
		<Dropdown
			trigger="click"
			transfer
			:transfer-class-name="themeOptions.skin"
			placement="bottom-end">
			<i class="card-menu-btn bl-icon-more"></i>
			<DropdownMenu slot="list">
				<DropdownItem @click.native="deleteComponent">
					删除
				</DropdownItem>
				<DropdownItem @click.native="copyComponent">复制</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import VisualDashboardRollback from '@store/modules/visual-dashboard-rollback'
import VisualDashboardStore, {
	BiComponent,
} from '@/store/modules/visual-dashboard'
import {
	findComponentIndex,
	generateGuid,
} from '../../../screen-edit/scripts/utils'
import { deepClone } from '@/scripts/utils'
// 组件

@Component
export default class ComponentList extends Vue {
	@Prop() nodeInfos: BiComponent
	// 页面样式配置
	get themeOptions() {
		return VisualDashboardStore.themeOptions
	}

	deleteComponent() {
		const { guid } = this.nodeInfos
		VisualDashboardStore.deleteComponent(guid)
		VisualDashboardRollback.pushRecord()
	}

	copyComponent() {
		const data = deepClone(this.nodeInfos) as BiComponent
		const insertindex = findComponentIndex(this.nodeInfos.guid)
		const guid = generateGuid()
		Object.assign(data, {
			guid: guid,
			i: guid,
		})

		VisualDashboardStore.addNewComponent({
			data,
			index: insertindex,
		})
		VisualDashboardRollback.pushRecord()
	}
}
</script>

<style lang="scss" scoped>
.card-menu-btn-wrap {
	position: absolute;
	right: 8px;
	top: 10px;
	display: none;
}
.card-menu-btn {
	cursor: pointer;
	display: inline-block;
	@include size(28px);
	font-size: 18px;
	text-align: center;
}
</style>
