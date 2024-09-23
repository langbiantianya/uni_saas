/**
 * 返回用户信息
 * 由于通常前端需要对用户信息、登录token进行缓存
 * 故云函数对用户进行修改后，需要返回给前端最新的用户信息，以便前端始终能够缓存最新用户信息
 */

module.exports = [{
	id: "test",
	// 符合下方正则条件的云函数才会进入该中间件
	regExp: [
		'^sys'
	],
	description: "测试中间件",
	index: 200,
	mode: "before", // 可选 before after
	enable: true, // 通过设置enable=false可以关闭该中间件
	main: async function(event) {}
}]