module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/essential',
		// '@vue/standard',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
	],
	parserOptions: {
		// parser: 'babel-eslint',
		parser: '@typescript-eslint/parser',
		ecmaFeatures: {
			legacyDecorators: true,
		},
	},
	rules: {
		quotes: ['warn', 'single'],
		semi: ['warn', 'never'],
		'prefer-template': 'error', // 优先使用字符串模板
		'no-lone-blocks': 'error',
		'prefer-const': [
			'error',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: false,
			},
		],
		'space-before-blocks': ['warn', 'always'],
		camelcase: 'off', // 允许小写+下划线
		'no-eval': 'error', // 不使用 eval
		'no-var': 'error', // 不使用 var
		'no-extra-boolean-cast': 'off', // 禁止不必要的布尔类型转换
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-case-declarations': 'off', // 允许在 case 中定义变量
		'no-unused-expressions': 'off', // 允许使用逻辑短路的三元运算符
		'require-await': 'error',
		// typescript
		'prettier/prettier': [
			'error',
			{
				// 单行代码字符数限制
				// printWidth: 100,
				// tab键缩进相当于2个空格
				tabWidth: 4,
				// 行缩进使用空格
				useTabs: true,
				// 语句的末尾不加分号
				semi: false,
				// 使用单引号
				singleQuote: true,
				//仅仅当必须的时候才会加上双引号
				quoteProps: 'as-needed',
				// 在 JSX 中使用单引号
				jsxSingleQuote: true,
				// 尾逗号
				trailingComma: 'es5',
				//在括号和对象的文字之间加上一个空格
				bracketSpacing: true,
				// html 标签> 不单独起一行
				bracketSameLine: true,
				// 当箭头函数中只有一个参数的时候忽略括弧
				arrowParens: 'avoid',
				// vue template 中的结束标签结尾尖括号掉到了下一行
				htmlWhitespaceSensitivity: 'ignore',
				// .vue 文件，不缩进 <script> 和 <style> 里的内容
				vueIndentScriptAndStyle: false,
				endOfLine: 'auto'
			},
		],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/class-literal-property-style': 'warn',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/prefer-optional-chain': 'warn',
		'@typescript-eslint/array-type': 'warn',
		'@typescript-eslint/consistent-indexed-object-style': 'warn',
		'@typescript-eslint/no-duplicate-imports': 'warn',
		// '@typescript-eslint/camelcase': 0, // 目前埋点有部分字段无法更换
		'@typescript-eslint/no-non-null-assertion': 'off', // 允许非空断言运算符
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ args: 'after-used', ignoreRestSiblings: true },
		],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 0, // TODO
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				extendDefaults: true,
				types: {
					'{}': false,
				},
			},
		],
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
			env: {
				jest: true,
			},
		},
	],
}
