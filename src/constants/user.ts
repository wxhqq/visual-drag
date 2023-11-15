// ---------------------- 用户管理 ---------------------
// 用户组别
export const GROUP = {
	ADMIN: '管理员',
	SECURITY_ENGINE: '安全工程师',
	CONFIG_ENGINE: '配置工程师',
	AUDITOR: '审计员',
}

// 用户状态
export const USER_STATUS = {
	false: '禁用',
	true: '启用',
}
// 认证类型
export const USER_AUTH_METHOD = {
	1: '用户密码',
	2: 'APP口令',
	4: 'Radius口令',
}
