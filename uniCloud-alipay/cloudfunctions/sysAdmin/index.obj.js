// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	login(param1) {
		// 两种异常处理方式 
		// throw '直接抛出错误信息上层接收' 
		// return 抛出至少需要 errCode errMsg
		// return {
		// 	errCode: -1,
		// 	errMsg: '返回对象格式错误',
		// }

		return {
			errCode: 0,
			errMsg: '正常',
		}
	}
}