// 加载模块 - 中间件 请勿改动此文件-----------------------------------
const modulesPath = __dirname + "/modules";
const { logger } = require('wmSdk')
const fs = require('fs');
const fileList = fs.readdirSync(modulesPath);
let moduleList = [];
let modulesNames = [];

fileList.map((file, index) => {
	if (file.indexOf(".js") > -1) {
		modulesNames.push(file.substring(0, file.length - 3));
	}
});

modulesNames.forEach((modulesName, index) => {
	try {
		let moduleItem = require(modulesPath + "/" + modulesName);
		moduleItem.map((item) => {
			item.modulesName = modulesName;
		});
		moduleList.push(moduleItem);
	} catch (err) {
		logger.error(`【异常】加载中间件【${modulesName}】异常，请检查！↓↓↓请查看下方的错误提示↓↓↓`);
		logger.error(err);
		logger.error(`【异常】加载中间件【${modulesName}】异常，请检查！↑↑↑请查看上方的错误提示↑↑↑`);
	}
})

let middlewareList = moduleList.map((moduleItem, index) => {
	return moduleItem
}).flat(Infinity)
module.exports = middlewareList;
// 加载模块 - 中间件 请勿改动此文件-----------------------------------