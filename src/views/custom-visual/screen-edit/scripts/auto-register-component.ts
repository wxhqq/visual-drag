const allComponents = require.context(
	'../visual-components/',
	true,
	/\/(Component|Attrs|DataSettings)\.vue$/
)
const componentList = {}
const attrsComponentList = {}
const dataSettingsComponentList = {}

// allComponents.keys() 返回的是匹配到的带有路径的文件名数组
const matchReg = /^\.\/(\w*)\/(\w*).+$/
allComponents.keys().forEach(fileName => {
	// allComponents(fileName) 返回该组件上下文内容
	const component = allComponents(fileName)
	// component.default 返回该组件上下文内容请求
	const comName = fileName.replace(matchReg, '$2')
	const key = fileName.replace(matchReg, '$1')
	if (comName === 'Component') {
		componentList[key] = component.default
	} else if (comName === 'Attrs') {
		attrsComponentList[`${key}Attr`] = component.default
	} else if (comName === 'DataSettings') {
		dataSettingsComponentList[`${key}DataSettings`] = component.default
	}
})

// 组件
export const VisualComponentList = componentList

// 属性组件
export const VisualAttrsList = attrsComponentList

// 数据组件
export const VisualDataSettingsList = dataSettingsComponentList
