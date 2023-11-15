<template>
	<div
		class="bl-table"
		:id="`table-${tableID}`"
		v-on-resize="calculateHeight">
		<div
			ref="tableRef"
			class="card-wrapper"
			:style="{ height: `${tableHeight}px` }"
			v-if="isCardPage">
			<slot name="card-page"></slot>
		</div>
		<!-- 列表 -->
		<Table
			ref="tableRef"
			v-else
			stripe
			:height="fixHeight || tableHeight"
			:columns="columns"
			:data="data"
			:highlight-row="isHighLight"
			:row-class-name="setTableRowClass"
			@on-expand="handleExpand"
			@on-select="handleSelect"
			@on-select-cancel="handleSelectCancle"
			@on-select-all="handleSelectAll"
			@on-select-all-cancel="handleSelectAllCancle('table')"
			@on-sort-change="handleSort"
			@on-row-click="onRowClick">
			<template
				v-for="(item, index) in columns"
				slot-scope="{ row }"
				:slot="item.slot">
				<div :key="index">
					<slot :row="row" :name="item.slot"></slot>
				</div>
			</template>
		</Table>
		<!-- 分页 -->
		<div class="flex-justify-end">
			<slot name="cnnvd"></slot>
			<span class="total-show" v-show="maxPage">
				共 {{ totalData }} 条
			</span>
			<Page
				v-if="showPager"
				:show-sizer="showPageSize"
				class="bottom-right-pager"
				:show-elevator="showElevator"
				:show-total="!maxPage"
				:current="filterParams.page"
				:page-size="filterParams.page_size"
				:total="computedTotalData"
				:page-size-opts="pageSizeOptions"
				@on-change="pageChange"
				@on-page-size-change="pageSizeChange" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

@Component
export default class BlTable extends Vue {
	@Ref('tableRef') tableRef: any
	// 筛选条件   如果存在page和page_size 则存在分页
	@Prop({ default: () => {} }) filterParams: {
		page_size: number //20| 30| 50,
		page: number
		ordering: string
	}
	// 勾选的数量
	@Prop({ default: () => [] }) checkedIds: number[]
	// 表头信息
	@Prop({ default: () => [] }) columns: []
	// 列表数据
	@Prop({ default: () => [] }) data: []
	// 列表数据
	@Prop({ default: false }) isFilterShow: boolean
	// 是否需要高亮行（点击高亮）
	@Prop({ default: false }) isHighLight: boolean
	// 是否为卡片列表
	@Prop({ default: false }) isCardPage: boolean
	// 是否为卡片列表
	@Prop({ default: 0 }) totalData: number
	// 是否展示分页
	@Prop({ default: true }) showPager: boolean
	// 显示电梯，可以快速切换到某一页
	@Prop({ default: true }) showPageSize: boolean
	// 是否展示每页条数配置
	@Prop({ default: true }) showElevator: boolean
	// 固定高度
	@Prop({ default: 0 }) fixHeight: number
	// 列表分页器离页面窗口底部的距离 一般表格分页器距离底部距离是0
	@Prop({ default: 0 }) pagerBottom: number
	// 最多页数， 部分列表，不允许超过1000页
	@Prop({ default: 0 }) maxPage: number

	tableHeight = 200
	// 分页
	pageSizeOptions = [20, 30, 50] // 分页大小可选项
	// 多选
	checkedIdsSet = new Set() // 多选选中项,set 去重

	// 表格ID 确保唯一性，避免一个页面出现多表格时高度计算有误差
	tableID = new Date().valueOf()

	get computedTotalData() {
		let total = this.totalData
		if (
			this.totalData &&
			this.maxPage &&
			total > this.maxPage * this.filterParams.page_size
		) {
			total = this.maxPage * +this.filterParams.page_size
		}
		return total
	}
	@Watch('isFilterShow')
	onChangeFilterShow() {
		this.$nextTick(() => {
			this.calculateHeight()
		})
	}
	mounted() {
		this.calculateHeight()
	}
	@Watch('checkedIds')
	onChangeCheckedIds(val: number[]) {
		if (!val.length) {
			this.checkedIdsSet.clear()
		}
	}

	// 设置表格偶数行背景色，使展开的行与所属项同色，设置斑马纹
	setTableRowClass(row: { id: number }, index: number) {
		// NOTE：用于标识每一行，以便在每行展开时获取到单个行距离顶部的偏移位置，存进记忆栏
		const rowClass = `table-row-${row.id}`

		if (index % 2 !== 0) {
			return `${rowClass} custom-table-even-lines`
		}
		return `${rowClass} custom-table-odd-lines`
	}
	// 计算表格高度
	calculateHeight() {
		if (this.tableRef) {
			const tableDom = this.tableRef.$el || this.tableRef
			let tableH = window.innerHeight
			tableH -= tableDom.getBoundingClientRect().top
			// 判断是否有页码
			if (
				document
					.querySelector(`#table-${this.tableID}`)
					?.querySelector('.bottom-right-pager')
			) {
				tableH -= 70 // 分页器高度
			} else {
				tableH -= 32 // 离下边距离
			}
			// 最小高度为200
			if (tableH < 200) {
				tableH = 200
			}
			// 减去分页器距离窗口底部的距离
			tableH -= this.pagerBottom
			this.tableHeight = tableH
		}
	}
	// 全选
	handleSelectAll(selectedArr: { id: number }[]) {
		selectedArr.map(item => {
			// 列表没有ID时，勾选其他项
			this.checkedIdsSet.add(item.id)
		})
		this.updateCheckedIds([...this.checkedIdsSet]) // 更新
	}
	// 取消全选
	handleSelectAllCancle() {
		this.tableRef.data.forEach((item: { id: number }) => {
			if (this.checkedIdsSet.has(item.id)) {
				this.checkedIdsSet.delete(item.id)
			}
		})
		this.updateCheckedIds([...this.checkedIdsSet]) // 更新
	}
	// 选中某一项
	handleSelect<T>(selection: T, row: { id: number }) {
		this.checkedIdsSet.add(row.id)
		this.updateCheckedIds([...this.checkedIdsSet]) // 更新
	}
	// 取消选中某一项，为了兼顾全选后取消选中某一项，要从已选择的 arr 里删掉这一项，而不是直接使用已选中项
	handleSelectCancle<T>(selection: T, row: { id: number }) {
		this.checkedIdsSet.delete(row.id)
		this.updateCheckedIds([...this.checkedIdsSet]) // 更新
	}
	// 列表排序
	handleSort(data: { key: string; order: string }) {
		const { key, order } = data
		// 当使用默认排序方式或者按降序排列时(时间离现在越来越远)
		if (order === 'normal' || order === 'desc') {
			this.filterParams.ordering = `-${key}`
		} else {
			// 升序排列
			this.filterParams.ordering = `${key}`
		}

		this.filterParams.page = 1
		this.$emit('on-page-change')
	}
	// 页码改变的回调，返回改变后的页码
	pageChange(page: number) {
		this.filterParams.page = page
		this.$emit('on-page-change')
	}

	// 展开详情
	handleExpand<T, U>(row: T, status: U) {
		this.$emit('on-expand', row, status)
	}
	// 点击行
	onRowClick<T, U>(row: T, index: U) {
		this.$emit('on-row-click', row, index)
	}
	// 改变分页大小 页码变为1
	pageSizeChange(page_size: number) {
		this.filterParams.page = 1
		this.filterParams.page_size = page_size
		this.$emit('on-page-change')
	}
	// 清空选择的数据
	clearCheckedIds() {
		this.checkedIdsSet.clear() // 重置选中项
		this.updateCheckedIds([...this.checkedIdsSet]) // 更新
	}
	// 同步勾选信息
	updateCheckedIds<T>(data: T) {
		this.$emit('update:checkedIds', data)
	}
}
</script>

<style lang="scss" scoped>
.card-wrapper {
	overflow-y: scroll;
	overflow-x: hidden;
}
.bl-table {
	overflow: hidden;
}
.total-show {
	font-size: 12px;
	margin: 26px 10px 0 0;
}
</style>
