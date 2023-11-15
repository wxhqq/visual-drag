import { Component, Vue } from 'vue-property-decorator'
import { debounce } from '@utils'

let filterParamsCatch = {}
@Component
export default class TableMixin extends Vue {
	isSpinShow = false //加载框显示
	checkedIds: number[] = [] // 多选选中项,set 去重
	totalData = 0 //列表总数据
	currentId: null | number = null
	isFilterShow = false //是否显示过滤框
	hasFilters = false // 筛选条件显隐
	get hasSelected() {
		return !!this.checkedIds.length
	}

	filterParams = {
		page: 1,
		page_size: 20,
	}

	tableColumns: any
	// 列配置
	get configuredColumns() {
		return this.tableColumns.filter(
			(item: { isHidden: boolean }) => !item.isHidden
		)
	}
	created() {
		filterParamsCatch = {}
		filterParamsCatch = JSON.parse(JSON.stringify(this.filterParams))
	}
	// 搜索时间防抖 避免多次调用
	searchEvents = debounce(() => {
		this.backTofirstPage()
		this.getTableList()
	}, 100)

	// 返回第一页
	backTofirstPage() {
		this.filterParams.page = 1
	}

	// 重置搜索条件
	resetFilter() {
		this.resetFilterParams()
		this.searchEvents()
	}

	// 重置筛选条件，除 page 和 page_size 字段，这两个字段由searchEvents 方法处理
	resetFilterParams() {
		this.filterParams = JSON.parse(JSON.stringify(filterParamsCatch))
	}

	/**
	 * 最后一页只有一条数据时，在编辑后需要刷新列表，修改某些字段某会对查询结果数量有影响，
	 * 可能会导致页码减少一页或这不变(与删除不同。删除一定会导致 page 减少)，需要处理查询参数中的 page 字段
	 * 需要减少 page 字段值的情况需要满足以下条件：
	 *  1. 编辑的项是最后一页最后一项
	 *  2. 编辑的字段在列表的筛选条件中
	 *  2. 编辑的字段在筛选条件中的同一字段不为全部的含义（如果为全部不会对查询结果有影响）
	 * @param { Object } editData   修改后 请求返回的数据
	 */
	afterEditSingle(editData = {}) {
		if (
			Object.keys(editData).length &&
			this.totalData % this.filterParams.page_size === 1 &&
			this.filterParams.page ===
				Math.ceil(this.totalData / this.filterParams.page_size)
		) {
			// 判断 paramsObj 中的字段在 filtersObj相同字段值是否一致
			Object.keys(editData).forEach(key => {
				if (
					editData[key] &&
					this.filterParams[key] &&
					editData[key] !== this.filterParams[key]
				) {
					this.filterParams.page = this.filterParams.page - 1 || 1
					this.filterParams.page = this.filterParams.page
				}
				return (
					editData[key] &&
					this.filterParams[key] &&
					editData[key] !== this.filterParams[key]
				)
			})
		}
		this.getTableList()
	}
	// 单个数据删除后（如果是最后一页仅有一个数据， 被删除时） 页码处理
	afterDeleteSingle() {
		if (
			this.totalData % this.filterParams.page_size === 1 &&
			this.filterParams.page ===
				Math.ceil(this.totalData / this.filterParams.page_size)
		) {
			this.filterParams.page = this.filterParams.page - 1 || 1
		}
		this.getTableList()
	}

	// 获取表格数据必须使用这个方法， 在实例中重写该方法
	getTableList() {}
}
