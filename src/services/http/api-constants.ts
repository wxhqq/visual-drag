// 接口 url
const API = {
	// -------------------  登录登出  -----------------------
	LOGIN: '/user/login/', // 用户登录 [post]
	LOGOUT: '/user/logout/', // 用户登出 [get]

	// -------------------  用户个人信息  --------------------
	USER_APP_AUTHORIZED: '/user/{id}/app/', // 获取app口令信息
	USER_CHANGE_PASSWORD: '/user/modify_password/', // 用户自身修改密码 [put]
	MENU_SETTING: '/setting/menu',
}
export default API
