// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj

const { usersController, rolesController, permissionsController ,domainsController} = require("./account")
const { ControllerAction, Context, errors } = require('wmSdk')

// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async users(context) {
		// const controller = 
		return new ControllerAction(usersController, context)
	},
	async roles(context) {
		// const controller =
		return new ControllerAction(rolesController, context)
	},
	async permissions(context) {
		return new ControllerAction(permissionsController, context)
	},
	async domains(context){
		return new ControllerAction(domainsController, context)
	},
	async _after(error, result) {
		let res
		if (error) {
			return errors.callError(error)
		}
		try {
			res = await result.invok()
		} catch (err) {
			return errors.callError(err)
		}

		return res
	}
	// /**
	//  * method1方法描述
	//  * @param {string} param1 参数1描述
	//  * @returns {object} 返回值描述
	//  */
	// login(context) {
	// 	// 两种异常处理方式 
	// 	// throw '直接抛出错误信息上层接收' 
	// 	// return 抛出至少需要 errCode errMsg
	// 	// return {
	// 	// 	errCode: -1,
	// 	// 	errMsg: '返回对象格式错误',
	// 	// }
	// 	// console.log(context.clientInfo())
	// 	// console.log(context.cloudInfo())
	// 	// console.log(context.uniIdToken())
	// 	// console.log(context.methodName())
	// 	// console.log(context.params())
	// 	// console.log(context.uniCloudRequestId())
	// 	// console.log(context.httpInfo())
	// 	return {
	// 		errCode: 0,
	// 		errMsg: '正常',
	// 	}
	// }
}