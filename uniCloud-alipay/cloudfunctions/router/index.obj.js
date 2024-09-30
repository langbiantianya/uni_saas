// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const middlewareList = require('./middleware/index.js')
const wmSdk = require('wmSdk') // 常用涉及到uniCloud的工具包
const createConfig = require('uni-config-center')
const jwt = require('jsonwebtoken')
/**
 * loadMiddleware 加载中间件
 */

const loadAfterMiddleware = async (context) => {
	let serviceRes
	for (const element of middlewareList) {
		// sys开头 需要走用户体系权限验证的 中间件 regExp 中定义
		// pub开头的云对象  不需要走用户体系权限验证 中间件 regExp 中定义
		// 索引为三百的中间件 为系统内置中间件 比如资源校验 用户体系权限验证
		if (element instanceof wmSdk.middleware.After && element.enable) {
			// 正则验证 中间的url匹配
			let run = false
			element.regExp.forEach(e => {
				let reg = new RegExp(e) // 验证对应的中间件
				if (reg.test(context.scopeObj.scope)) {
					run = true
				}
			})
			if (run) {
				try {
					// 匹配对应的中间件加载
					let midRes = await element.main(context)
					if (midRes) {
						Object.assign(serviceRes, midRes)
					}
					// 聚合返回的中间件属性对象，重复排序往后覆盖
				} catch (error) {
					throw wmSdk.errors.fmtError(error, context, "middleware")
				}
			}

		}
	}
	return serviceRes
}

const loadBeforeMiddleware = async (context) => {
	let serviceRes
	for (const element of middlewareList) {
		// sys开头 需要走用户体系权限验证的 中间件 regExp 中定义
		// pub开头的云对象  不需要走用户体系权限验证 中间件 regExp 中定义
		// 索引为三百的中间件 为系统内置中间件 比如资源校验 用户体系权限验证
		if (element instanceof wmSdk.middleware.Before && element.enable) {
			// 正则验证 中间的url匹配
			let run = false
			element.regExp.forEach(e => {
				let reg = new RegExp(e) // 验证对应的中间件
				if (reg.test(context.scopeObj.scope)) {
					run = true
				}
			})
			if (run) {
				try {
					// 匹配对应的中间件加载
					let midRes = await element.main(context)
					if (midRes) {
						Object.assign(serviceRes, midRes)
					}
					// 聚合返回的中间件属性对象，重复排序往后覆盖
				} catch (error) {
					throw wmSdk.errors.fmtError(error, context, "middleware")
				}
			}

		}
	}
	return serviceRes
}
const db = uniCloud.database()
const dbCmd = db.command
const unIdConfig = createConfig({ pluginId: 'uni-id' }).config()
module.exports = {
	async _before() {
		// 通用预处理器
		// 拦截器 或者 过滤器
		// 这里处理权限相关
		// 加载casbin
		const e = await wmSdk.enforcer
		let payload
		try {
			payload = jwt.verify((this.getHttpInfo().headers.Authorization || this.getHttpInfo().headers.authorization).replace(/Bearer\s+/g, "") || this.getUniIdToken(), unIdConfig.tokenSecret)
		} catch (error) {
			wmSdk.logger.error("verify Token", error)
			throw new wmSdk.errors.NotAuthorizedError()
		}
		// 数据库查询用户信息
		let user = (await wmSdk.repo.info("uni-id-users", payload.uid))
		// 获取作用域 例如用户属于哪个子公司
		if (!user) {
			throw new wmSdk.errors.NotAuthorizedError()
		}
		// 判断如果是superAdmin 角色加superAdmin域直接放行
		if (user.role.includes("superAdmin") && user.domains.includes("superAdmin")) {
			return
		}
		// 获取资源路径sysAdmin.users.list
		let obj = this.getClientInfo().invok || JSON.parse(this.getHttpInfo().body).invok || this.getHttpInfo().headers.invok
		let act = this.getClientInfo().httpMethod || this.getHttpInfo().httpMethod
		// 获取动作 例如(get,post,put,delete)	
		if (
			// 											分类	域					分类		用户
			((await e.loadFilteredPolicy(dbCmd.or({ ptype: "p", v1: user.domains }, { ptype: "g", v0: user.username })))
				// 用户  域  云函数 动作
				&& (await e.enforce(user.username, user.domains, obj, act))
			) !== true) {
			throw new wmSdk.errors.NotAuthorizedError()
		}
	},
	/**
	 * router 调用service层方法
	 * 请求体必须携带invok字段
	 */
	async api(event, context) {
		let payload
		try {
			payload = jwt.verify((this.getHttpInfo().headers.Authorization || this.getHttpInfo().headers.authorization).replace(/Bearer\s+/g, "") || this.getUniIdToken(), unIdConfig.tokenSecret)
		} catch (error) {
			wmSdk.logger.error("verify Token", error)
			throw new wmSdk.errors.NotAuthorizedError()
		}
		// 数据库查询用户信息
		let user = await wmSdk.repo.info("uni-id-users", payload.uid)

		let wmContext = new wmSdk.Context(event, context, this,user)
		wmSdk.logger.info(wmContext.getUser)
		let action = new wmSdk.Action(wmContext)
		return action.invok(
			async (ctx) => {
				loadBeforeMiddleware(ctx).then()
				// 调用实际方法前执行
			},
			async (ctx) => {
				// 调用方法之后执行
				loadAfterMiddleware(ctx).then()
			},
			(error) => {
				throw error
			})
	},
	async _after(error, result) {
		if (error) {
			return wmSdk.errors.callError(error)
		}
		//对出参封装 
		if ((typeof result) == Object && "errCode" in result) {
			return await result
		} else {
			return {
				errCode: 0,
				errMsg: 'ok',
				data: await result
			}
		}
	}
}