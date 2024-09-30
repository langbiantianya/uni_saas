const jwt = require('jsonwebtoken')
const createConfig = require('uni-config-center')
const { info } = require('../repo')
const { logger } = require('../logger')

const unIdConfig = createConfig({ pluginId: 'uni-id' }).config()
//添加用户信息
class Context {
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-client-info
	clientInfo = () => {
		return this.uniCloudThat.getClientInfo()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-cloud-info
	cloudInfo = () => {
		return this.uniCloudThat.getCloudInfo()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-uni-id-token
	uniIdToken = () => {
		return this.uniCloudThat.getUniIdToken()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-method-name
	methodName = () => {
		return this.uniCloudThat.getMethodName()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-params
	params = () => {
		return this.uniCloudThat.getParams()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-request-id
	uniCloudRequestId = () => {
		return this.uniCloudThat.getUniCloudRequestId()
	}
	// https://doc.dcloud.net.cn/uniCloud/cloud-obj.html#get-http-info
	httpInfo = () => {
		return this.uniCloudThat.getHttpInfo()
	}
	scopeObj() {
		let invokArray
		if (JSON.stringify(this.uniEvent) !== "{}" && this.uniEvent) {
			invokArray = this.uniEvent.invok.split(".")
		} else {
			invokArray = (JSON.parse(this.httpInfo.body).invok || this.httpInfo.headers.invok).split(".")
		}
		return {
			scope: invokArray[0],
			controller: invokArray[1],
			funcName: invokArray[2],
		}
	}

	body = () => {
		let body

		if (JSON.stringify(this.uniEvent) !== "{}" && this.uniEvent) {
			body = this.uniEvent.data
		} else {
			body = JSON.parse(this.httpInfo.body)
		}
		return body
	}

	/**
	 * 
	 * @param {object} event https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#event%E5%AF%B9%E8%B1%A1
	 * @param {object} context https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html#context
	 * @param {object} that uniCoud的this执向
	 */
	constructor(event, context, uniCloudThat,user) {
		this.uniEvent = event
		this.uniContext = context
		this.uniCloudThat = uniCloudThat
		this.clientInfo = this.uniCloudThat.getClientInfo()
		this.cloudInfo = this.uniCloudThat.getCloudInfo()
		this.uniIdToken = this.uniCloudThat.getUniIdToken()
		this.methodName = this.uniCloudThat.getMethodName()
		this.params = this.uniCloudThat.getParams()
		this.uniCloudRequestId = this.uniCloudThat.getUniCloudRequestId()
		this.httpInfo = this.uniCloudThat.getHttpInfo()
		this.scopeObj = this.scopeObj()
		this.body = this.body()
		this.user = user
	}
}

module.exports = Context