import qs from 'qs'
import axios, { AxiosRequestConfig } from 'axios'
import router from '@/router'

// 消息提示
import { Message, Notice } from 'view-design'
// 加密token
import { getStore, clearStore, getType } from '@utils'

// axios 基本配置
const CONFIG: AxiosRequestConfig<any> = {
	baseURL: process.env.VUE_APP_BASE_URL, // 请求基础 url 前缀
	method: 'post', // 请求方式
	headers: {
		'Content-Type': 'application/json;charset=UTF-8', // 请求头信息
	},
	timeout: 20000, // 设置过期时间
	withCredentials: true, // 携带凭证，此处设置允许携带 cookie
	responseType: 'json', // 返回数据类型
	validateStatus(status: number) {
		// 定义 resolve 响应状态码
		return (status >= 200 && status < 300) || status === 499
	},
}

// 状态码对应错误提示
const errorCodeMessage = {
	timeout: '网络出现问题，请重新登录',
	401: '未授权，请重新登录',
	403: '未授权，请重新登录',
	404: '数据不存在，请刷新页面',
	408: '请求超时',
	500: '服务器内部错误',
	501: '服务器未实现',
	502: '网关错误',
	503: '服务器正在维护，请稍等！',
	504: '网关超时',
	505: 'HTTP版本不受支持',
}

// 用于显示请求错误提示信息的方法，同页面多个请求错误只提示一次
// 一秒内只提示1次
let errMsgDurationFlag = false
const handleErrorMsgOnce = (msg: string) => {
	if (errMsgDurationFlag) return
	errMsgDurationFlag = true
	setTimeout(() => {
		errMsgDurationFlag = false
	}, 1500)

	Message['error']({
		duration: 3,
		content: msg,
	})
}

const handelErrorNotification = (msg: string) => {
	Notice['error']({
		title: '错误信息提示',
		duration: msg.replace(/\s*/g, '').length < 20 ? 5 : 10,
		render: (
			h: (arg0: string, arg1: { class: string }, arg2: string) => any
		) => {
			return h(
				'div',
				{
					class: 'white-space-pre line-height-15',
				},
				msg
			)
		},
	})
}
/**
 * @desc 对 axios 的配置信息、请求拦截器、响应拦截器进行二次封装及处理
 * @param { object } options
 *  options: {
 *      method: 'get',
 *      url: '',
 *      data: {}
 *  }
 */
const $axios = function (options: AxiosRequestConfig<any>) {
	return new Promise((resolve, reject) => {
		// 创建 axios 实例
		const instance = axios.create(CONFIG)

		// request 拦截器
		instance.interceptors.request.use(
			config => {
				const method = config?.method?.toLocaleLowerCase()
				const type = getType(config.data)

				// 加密 token
				const token = getStore('token')
				if (token && config.headers) {
					config.headers['Authorization'] = `Token ${token}`
				}

				// 机器定时请求携带请求头，用于控制轮询请求不影响自动登出
				if (config?.data?.machinePull && config.headers) {
					config.headers['MACHINE-PULL'] = true
					delete config.data.machinePull
				}

				// 根据请求方法，序列化传来的参数，上传文件时不可以序列化数据
				if (
					(method === 'post' ||
						method === 'put' ||
						method === 'patch') &&
					type !== 'formdata'
				) {
					config.data = qs.parse(config.data)
				}

				if (method === 'get') {
					config.data = qs.stringify(config.data)
					config.url = config.data
						? `${config.url}?${config.data}`
						: config.url
				}

				return config
			},
			error => {
				return Promise.reject(error)
			}
		)

		// response 拦截器
		instance.interceptors.response.use(
			response => {
				const { status, data, headers } = response
				// 返回的数据
				const result = {
					status,
					data,
					headers, // 用于处理文件流
				}
				// 499
				if (status === 499 && data?.detail) {
					handelErrorNotification(data.detail)
					return null
				}
				return result
			},
			err => {
				// 超时
				if (/timeout\sof\s\d+ms\sexceeded/.test(err.message)) {
					handleErrorMsgOnce(errorCodeMessage.timeout)

					return null
				}

				// 处理在 errorCodeMessage 中的状态码
				if (err?.response?.status) {
					const { status } = err.response
					const msg =
						errorCodeMessage[status] || errorCodeMessage.timeout
					handleErrorMsgOnce(msg)

					// 401 和 403 需要跳转到登录页
					if (status === 401 || status === 403) {
						clearStore()
						router.push('/login')
					}
				}

				err.message = null

				return null
			}
		)

		// 请求处理
		instance(options)
			.then(res => {
				if (!res) {
					reject()
					return
				}

				const { status } = res

				if (
					status &&
					(status === 201 || status === 200 || status === 204)
				) {
					resolve(res)
				} else {
					reject()
				}
			})
			.catch(err => {
				reject(err)
			})
	})
}

export default $axios
