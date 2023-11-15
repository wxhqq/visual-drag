import $axios from '@services/http/axios'
import API from '@services/http/api-constants'

// ----------------------------   登录登出 -------------------------
// 用户登录
const login = <T>(data: T) => {
	return $axios({
		url: API.LOGIN,
		method: 'POST',
		data,
	})
}

// 用户登出
const logout = () => {
	return $axios({
		url: API.LOGOUT,
		method: 'GET',
	})
}

// ------------------------------- 用户个人信息  --------------------------
// 修改密码
const changePassword = <T>(data: T) => {
	return $axios({
		url: API.USER_CHANGE_PASSWORD,
		method: 'POST',
		data,
	})
}

// 获取APP认证详情 [GET]：秘钥、二维码
const getAppDetail = (id: string) => {
	return $axios({
		url: `${API.USER_APP_AUTHORIZED.replace('{id}', id)}`,
		method: 'GET',
	})
}

// 保存APP口令
const saveAppCode = <T>(id: string, data: T) => {
	return $axios({
		url: `${API.USER_APP_AUTHORIZED.replace('{id}', id)}`,
		method: 'POST',
		data,
	})
}

// 清除APP认证
const delAppCode = (id: string) => {
	return $axios({
		url: `${API.USER_APP_AUTHORIZED.replace('{id}', id)}`,
		method: 'DELETE',
	})
}

// 获取快捷菜单
const getQuickMenus = () => {
	return $axios({
		url: API.MENU_SETTING,
		method: 'GET',
	})
}
// 获取快捷菜单
const setQuickMenus = <T>(data: T) => {
	return $axios({
		url: API.MENU_SETTING,
		method: 'POST',
		data,
	})
}
export const user = {
	// 登录登出
	login,
	logout,
	// 个人信息
	changePassword,
	getAppDetail,
	saveAppCode,
	delAppCode,

	getQuickMenus,
	setQuickMenus,
}
