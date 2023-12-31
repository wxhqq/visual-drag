// 图表调色盘
// 柱状图渐变色为相应颜色的透明度 1~0；折线图折线线颜色使用相应颜色，渐变为相应颜色透明度的 0.25~0；饼状图直接使用相应颜色
// 注意：添加时也要写成 rgba 的形式，opacity 默认为 1，逗号后加空格，后面使用透明度的地方会统一进行替换

// 可视化页面使用的配色 当前为哪种主题，就将哪种主题颜色放在最前面
export const CHARTS_COLORS = [
	'rgba(0, 255, 230, 1)',
	'rgba(25, 118, 210, 1)',
	'rgba(0, 200, 83, 1)',
	'rgba(179, 136, 255, 1)',
	'rgba(0, 151, 167, 1)',
	'rgba(249, 168, 37, 1)',
	'rgba(129, 199, 132, 1)',
	'rgba(68, 138, 255, 1)',
	'rgba(234, 128, 252, 1)',
	'rgba(255, 234, 0, 1)',
	'rgba(126, 87, 194, 1)',
	'rgba(85, 139, 47, 1)',
	'rgba(192, 202, 51, 1)',
	'rgba(94, 53, 177, 1)',
	'rgba(225, 190, 231, 1)',
	'rgba(79, 195, 247, 1)',
]

// 普通页面使用的图表配色，当前为哪种主题，就将哪种主题颜色放在最前面
export const CHART_COLORS_ORDINARY = [
	'rgba(7, 144, 135, 1)',
	'rgba(109, 141, 206, 1)',
	'rgba(52, 144, 41, 1)',
	'rgba(57, 200, 190, 1)',
	'rgba(22, 67, 157, 1)',
	'rgba(186, 228, 112, 1)',
	'rgba(245, 184, 71, 1)',
	'rgba(117, 52, 4, 1)',
	'rgba(235, 183, 13, 1)',
	'rgba(255, 122, 128, 1)',
	'rgba(115, 89, 3, 1)',
	'rgba(230, 28, 37, 1)',
	'rgba(255, 190, 140, 1)',
	'rgba(117, 3, 9, 1)',
	'rgba(255, 225, 125, 1)',
]

// 提示类
export const TIPS = {
	pwd_diff: '您两次输入的密码不一致，请重新输入',
	// 正则检验失败后提示
	USERNAME: '以英文字母开头，6~16位，包含英文字母/数字', // 用户名
	IP: '格式  0~255.0~255.0~255.0~255', // IP
	IP_CIDR: '格式 0~255.0~255.0~255.0~255/0~32', // IP cidr
	IP_CIDR_16_32: '格式 0~255.0~255.0~255.0~255/16~32', // IP cidr
	MAC: '格式  1a:2b:3c:66:de:88', // mac 格式 小写
	MAC_UPPERCASE: '格式  1A:2B:3C:66:DE:88', // 审计 mac 格式大写
	MAC_UP_AND_LOW: '格式  1A:2B:3C:66:DE:88', // 防火墙 mac 大小写都可
	PORT: '格式 1~65535间的整数', // 端口格式
	CN_EN_NUMBER_CODE: '中文/英文/数字组成',
	RULE_NAME: '中文/英文/数字/下划线组成，不可以下划线开头',
	FIREWALL_DEVICE_NAME: '中文/英文/数字组成',
	IP_OR_IP_CIDR: '格式  0~255.0~255.0~255.0~255/0~32 (/0~32选填)', // ip 或 cidr 网段
	EMAIL: '请输入正确的邮箱',
	URL: '请输入正确的网址',
	VUL_SCANNING_TASK_NAME:
		'只允许包含数字/字母/中文/括号/下划线/短横线，20字以内',
}

// 正则, 正则校验名称不能存在| 和&的字符
export const REGEXP = {
	// ~^!@#$%&()\-_+=,.;'?[\]{}
	// 字母开头，字母和数字组成。6-16位
	USERNAME: /^[a-zA-Z]{1}[a-zA-Z0-9]{5,15}$/,
	// 8-16位，字母+数字+符号，~ ! @ # $ % ^ & ( )- _ + = , . ; ' ? ] [ } {，三种组成
	// IP v4，英文点分
	IP: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
	// IP 网段，如：192.168.166.1/24
	IP_CIDR:
		/^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\/(?:\d|[12]\d|3[012])$/,
	IP_CIDR_16_32:
		/^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\/(?:1[6-9]|2\d|3[012])$/,
	// IP v4 地址 或 ip v4 网段
	IP_OR_IP_CIDR:
		/^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\/(?:\d|[12]\d|3[012]))?$/,
	MASK: /^(254|252|248|240|224|192|128|0)\.0\.0\.0$|^255\.(254|252|248|240|224|192|128|0)\.0\.0$|^255\.255\.(254|252|248|240|224|192|128|0)\.0$|^255\.255\.255\.(254|252|248|240|224|192|128|0)$/,
	GATEWAY:
		/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
	MAC: /^[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}$/,
	MAC_UPPERCASE:
		/^[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}$/,
	MAC_UP_AND_LOW:
		/^[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}$/,
	PORT: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/,
	// 域名正则校验，由根域、顶级域、二级、三级……域名构成，每级域名之间用点分开，每级域名由字母、数字和减号构成（第一个字母不能是减号），不区分大小写，长度不超过63。
	DOMAIN: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+?$/,
	// 文件hash
	FILE_HASH: /^[a-fA-F0-9]{40}$/,
	// 多个 ip或ip_cidr(16-32)
	// MUTIL_IP_OR_CIDR: /^(?:(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\/(?:1[6-9]|2\d|3[012]))?,)*((?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\/(?:1[6-9]|2\d|3[012]))?)$/,
	MUTIL_IP:
		/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?)(,((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))|\*)((\/([012]\d|3[012]|\d))?))*$/,

	// TODO refactor 电话
	// 座机电话
	TEL: /^0\d{2,3}-?\d{7,8}$/,
	// 手机号码
	PHONE: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/,
	// EMAIL: /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/,
	EMAIL: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
	// ------------------------- 防火墙 ------------------------
	RULE_NAME: /^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/, // 规则名称，不可以下划线开头
	FIREWALL_DEVICE_NAME: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 设备名称，中/英/数字
	CN_EN_NUMBER_CODE: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 设备名称，中/英/数字
	URL: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
	VUL_SCANNING_TASK_NAME: /^[\u4e00-\u9fa5a-zA-Z0-9()（）\-_]{1,20}$/, //漏扫任务名称，中/英/数字/括号/下划线/短横线
}

// 背景色
export const BACKGROUND_COLOR = {
	dark: '深色背景',
	light: '浅色背景',
}

// 主题色
export const THEME_COLOR = {
	green: '木链绿',
	blue: '蓝色',
}

// 威胁等级
export const THREAT_LEVEL = {
	0: '极低',
	1: '低级',
	2: '中级',
	3: '高级',
}

// 高级等级
export const ALARM_LEVEL = {
	0: '无',
	1: '低级',
	2: '中级',
	3: '高级',
}
// 工控协议
export const PROTOCOL_INDUSTRY = {
	'ADS/AMS': 'ADS/AMS',
	'BACnet-APDU': 'BACnet-APDU',
	CIP: 'CIP',
	DNP3: 'DNP3',
	EGD: 'EGD',
	ENIP: 'ENIP',
	FINS: 'FINS',
	Fox: 'Fox',
	'GE-SRTP': 'GE-SRTP',
	'Hart/IP': 'Hart/IP',
	IEC103: 'IEC103',
	IEC104: 'IEC104',
	'IEC61850/GOOSE': 'IEC61850/GOOSE',
	'IEC61850/MMS': 'IEC61850/MMS',
	'IEC61850/SV': 'IEC61850/SV',
	Modbus: 'Modbus',
	OpcAE: 'OpcAE',
	OpcDA: 'OpcDA',
	OpcUA: 'OpcUA',
	Profinet: 'Profinet',
	S7COMM: 'S7COMM',
	'S7COMM-PLUS': 'S7COMM-PLUS',
	Umas: 'Umas',
}

// 网络协议
export const PROTOCOL_NETWORK = {
	FTP: 'FTP',
	HTTP: 'HTTP',
	Telnet: 'Telnet',
}

// 应用层协议
export const PROTOCOL_APPLYCATION_LAYER = {
	// 网络协议
	...PROTOCOL_NETWORK,
	// 工控协议
	...PROTOCOL_INDUSTRY,
}

// 传输层协议
export const PROTOCOL_TRANSPORT_LAYER = {
	1: 'TCP',
	2: 'UDP',
}

// 启用停用状态
export const YES_OR_NO_STATUS = {
	true: '启用',
	false: '停用',
}
