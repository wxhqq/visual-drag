import Vue from 'vue'
import VueRouter from 'vue-router'
/**
 * 路由配置， 子路由的配置需要严格按照顺序（保证面包屑定位）
 */

// 路由类型
type RoutType = {
	path: string
	name?: string
	component?: () => Promise<typeof import('*.vue')>
	redirect?: string
	children?: RoutType[]
}

// 解决路由已在当前页，重复点击一个路由报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function <T>(location: T) {
	return originalPush.call(this, location)['catch'](<T>(err: T) => err)
}

Vue.use(VueRouter)

const routes: RoutType[] = [
	{
		path: '/',
		component: () => import('@views/home/Index.vue'),
	},
	// 自定义大屏编辑
	{
		path: '/screenEdit',
		name: 'screen-edit',
		component: () => import('@/views/custom-visual/screen-edit/Index.vue'),
	},
	// 自定义大屏预览
	{
		path: '/screenPreview',
		name: 'screen-preview',
		component: () =>
			import('@/views/custom-visual/screen-edit/Preview.vue'),
	},
	// 仪表盘编辑
	{
		path: '/dashboardEdit',
		name: 'dashboard-edit',
		component: () =>
			import('@/views/custom-visual/dashboard/edit/Index.vue'),
	},
	{
		path: '/dashboardPreview',
		name: 'dashboard-preview',
		component: () =>
			import('@/views/custom-visual/dashboard/BiPreview.vue'),
	},
	{
		path: '*',
		redirect: '/',
	},
]

const router = new VueRouter({
	routes,
	mode: 'history',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0,
			}
		}
	},
})

export default router
