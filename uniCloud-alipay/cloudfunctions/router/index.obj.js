// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const middleware = require('./middleware/index.js')
const wmSdk = require('wmSdk') // 常用涉及到uniCloud的工具包

/**
 * loadMiddleware 加载中间件
 */
const loadMiddleware = async (mode, serviceRes, url, httpInfo, clientInfo, _that) => {
	let urlUnionList = url.split('/') //分解请求url
	for (let i = 0; i < middleware.length; i++) {
		// sys开头 需要走用户体系权限验证的 中间件 regExp 中定义
		// pub开头的云对象  不需要走用户体系权限验证 中间件 regExp 中定义
		// 索引为三百的中间件 为系统内置中间件 比如资源校验 用户体系权限验证
		if (middleware[i].mode == mode && middleware[i].enable) {
			// 正则验证 中间的url匹配
			let run = false
			middleware[i].regExp.forEach(e => {
				let reg = new RegExp(e) // 验证对应的中间件
				if (reg.test(urlUnionList[0])) {
					run = true
				}
			})
			if (run) {
				try {
					// 匹配对应的中间件加载
					let midRes = await middleware[i].main({
						url,
						httpInfo,
						clientInfo,
						uniCloud: _that
					})
					Object.assign(serviceRes, midRes); // 聚合返回的中间件属性对象，重复排序往后覆盖
				} catch (err) {
					throw err
				}
			}

		}
	}
	return serviceRes
}
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * router 调用下层云函对象方法
	 * @param {string} url url路径 云对象名称/云对象方法
	 * @param {object} data 数据
	 * @param {object} userInfo 调用者的数据 平台信息 用户信息 暂时这么写 后面写uni-id根据情况改变
	 * @returns {object} 返回值描述
	 */
	async api({
		url,
		data,
		userInfo
	}) {
		let _that = this
		const methodName = this.getMethodName() //获取当前调用的方法名
		let params = this.getParams() // 获取当前参数列表 client端即uniapp本身请求
		const httpInfo = this.getHttpInfo() // 获取url化时的http信息 url化请求
		const clientInfo = this.getClientInfo() // 获取客户端信息
		const getCloudInfo = this.getCloudInfo() // 获取云端信息 
		let paramsUrl = ""
		if (httpInfo) {
			paramsUrl = JSON.parse(httpInfo.body).url
		} else {
			paramsUrl = params[0].url
		}
		try {
			// console.log('methodName', methodName)
			// console.log('httpInfo', httpInfo)
			// console.log('middleware', middleware);
			// console.log('clientInfo', clientInfo);
			// console.log('getCloudInfo', getCloudInfo);
			// console.log('params', params);
			// 加载中间件
			let serviceRes = {}
			try {
				serviceRes = await loadMiddleware('before', serviceRes, paramsUrl, httpInfo, clientInfo, _that)

			} catch (err) {
				throw err
			}
			let urlUnionList = paramsUrl.split('/') //分解请求url
			// 中间件执行没有问题的话 // 调用云对象
			const cloud = uniCloud.importObject(urlUnionList[0])
			const res = await cloud[urlUnionList[1]]({
				url,
				data,
				userInfo,
				serviceRes,
				httpInfo,
				clientInfo
			}) // 执行调用方法
			if (!res) {
				throw url + '缺少返回值'
			}
			return res
		} catch (error) {
			console.error(url + '调用出错')
			throw error
		}
	},
	_after: async function(error, result) {
		let _that = this
		let params = this.getParams() // 获取当前参数列表
		const httpInfo = this.getHttpInfo() // 获取url化时的http信息
		const clientInfo = this.getClientInfo() // 获取客户端信息
		const requestId = this.getUniCloudRequestId()
		let paramsUrl = ""
		if (httpInfo) {
			paramsUrl = JSON.parse(httpInfo.body).url
		} else {
			paramsUrl = params[0].url
		}
		let addErr = async function(error, requestId) {
			// 判断是否是生产环境 不是生产环境添加日志
			let reg = new RegExp('^127.0.0.1')
			if (reg.test(clientInfo.clientIP)) {
				await wmSdk.repo.add('err-log', {
					params,
					httpInfo,
					clientInfo,
					uniCloud: _that,
					error: error,
					mode: 'after'
				}) // 添加到日志
			}
		}
		if (error) {
			console.error('_after:error', error);
			addErr(error, requestId)
			return {
				errCode: error.errCode,
				errMsg: error.errMsg,
				detail: error,
				requestId
			}
		}
		try {
			// 返回数据给前端
			return await loadMiddleware('after', result, paramsUrl, httpInfo, clientInfo, _that)
			// 操作日志 暂定
		} catch (error) {
			console.error('_after:error', error);
			addErr(error, requestId)
			return {
				errCode: error.errCode,
				errMsg: error.errMsg,
				detail: error,
				requestId
			}
		}
	}
}