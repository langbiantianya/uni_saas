const Context = require("../context");
const BasicService = require("../service");

// 待完善转换入参以及调用方法
class BasicController {

	updateConverter(ctx) {
		let body = ctx.body
		body._id = body.id
		delete body.id
		ctx.body = body
		return ctx
	}

	/**
	 * 该方法会在执行实际方法前调用
	 * 只需要定义 方法名Validator 的校验方法即可
	 * @param {Context} ctx 
	 * @param {String} verifyName 
	 * @returns {Boolean}
	 * 
	 *入参校验例子: 
	 * ```javascript
	 *addValidator(ctx){
	 *	let body = ctx.body
	 *	if(body["id"]){
	 *		return false
	 * 	}
	 *}
	 * ```
	 */
	validator(funcName, ctx) {
		if (this[`${funcName}Validator`]) {
			return this[`${funcName}Validator`](ctx)
		} else {
			return true
		}
	}
	/**
	 * 该方法会在执行实际方法前调用
	 * 只需要定义 方法名Validator 的校验方法即可
	 * @param {Context} ctx 
	 * @param {String} verifyName 
	 * @returns {Boolean}
	 * 
	 *入参转换例子: 
	 * ```javascript
	 *updateConverter(ctx){
	 *	let body = ctx.body
	 *	body._id = body.id
	 *	delete body.id
	 *	ctx.body = body
	 *	return ctx
	 *}
	 * ```
	 */
	converter(funcName, ctx) {
		if (this[`${funcName}Converter`]) {
			return this[`${funcName}Converter`](ctx)
		} else {
			return null
		}
	}
	/**
	 * 
	 * @param {Context} ctx 
	 */
	async add(ctx) {
		let body = ctx.body
		return await this.service.add(body.data)
	}
	/**
	 * 
	 * @param {Context} ctx 
	 */
	async addList(ctx) {
		let body = ctx.body
		return await this.service.addList(body.data)
	}

	/**
	* 
	* @param {Context} ctx 
	*/
	async update(ctx) {
		let body = ctx.body
		return await this.service.update(body.data.id, body.data)
	}


	/**
	 * 
	 * @param {Context} ctx 
	 */

	async info(ctx) {
		let body = ctx.body
		return await this.service.info(body.id)
	}
	async list(ctx) {
		let body = ctx.body
		return await this.service.list(body.where ?? null, body.field ?? null, body.orderBy ?? null)
	}
	/**
	 * 
	 * @param {Context} ctx 
	 */
	async page(ctx) {
		let body = ctx.body
		return await this.service.page(body.where, body.limit, body.currentPage, body.field, body.orderBy)
	}

	/**
	 * 
	 * @param {BasicService} service 
	 * @param {Boolean} del 是否开启删除接口
	 */
	constructor(service, del = true) {
		this.service = service
		if (del) {
			/**
			* 
			* @param {Context} ctx 
			*/
			this.deleteReal = async (ctx) => {
				let body = ctx.body
				return await this.service.deleteReal(body.id)
			}
			/**
			* 
			* @param {Context} ctx 
			*/
			this.delete = async (ctx) => {
				let body = ctx.body
				return await this.service.delete(body.id)
			}
		}

	}
}


module.exports = BasicController