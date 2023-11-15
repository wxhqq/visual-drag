<template>
	<Table
		class="v-table-wrapper"
		:class="skin"
		:columns="columns"
		:data="tableData"
		:stripe="nodeInfo.attrStyle.tableTheme === 'stripe'"
		:border="nodeInfo.attrStyle.tableTheme === 'border'"
		:height="tableHeight"></Table>
</template>

<script lang="ts">
import VisualDashboardStore, {
	BiComponent,
} from '@/store/modules/visual-dashboard'
import { ScreenComponent } from '@/store/modules/visual-screen'
import { Component, Prop, Vue } from 'vue-property-decorator'
// 组件

@Component
export default class Vtable extends Vue {
	@Prop() nodeInfo: ScreenComponent | BiComponent
	@Prop({ default: 'dark' }) skin: 'light' | 'dark' //皮肤  深浅
	tableData = [
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
		{
			head1: 'kakaka',
			head2: 'kakaka',
			head3: 'kakaka',
			head4: 'kakaka',
		},
	]

	// 表格高度
	get tableHeight() {
		if (this.nodeInfo['wrapStyle']) {
			const { cardGap } = VisualDashboardStore.themeOptions
			const height = this.nodeInfo['h'] * (30 + cardGap) - cardGap
			const { showTitle } = this.nodeInfo['wrapStyle']
			return showTitle ? height - (26 + 38) : height - 26
		} else {
			const { height } = this.nodeInfo['propStyle']
			return height - 2
		}
	}

	get columns() {
		return [
			{
				title: '表头1',
				key: 'head1',
			},
			{
				title: '表头2',
				key: 'head2',
			},
			{
				title: '表头3',
				key: 'head3',
			},
			{
				title: '表头4',
				key: 'head4',
			},
		]
	}
}
</script>

<style lang="scss">
@import '../../../styles/visual-screen/v-table.scss';
</style>
