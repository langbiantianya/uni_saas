/**
 * 返回用户信息
 * 由于通常前端需要对用户信息、登录token进行缓存
 * 故云函数对用户进行修改后，需要返回给前端最新的用户信息，以便前端始终能够缓存最新用户信息
 */
const { Context, middleware } = require('wmSdk')
module.exports = [

	new middleware.After(
		"test1", // 中间件id
		[
			'^sys'
		],
		"测试中间件", // 中间件描述
		200, // 中间件执行顺序
		true, // 是否启用
		async function (ctx) {
			console.log("after", ctx)
		}
	)]