const db = uniCloud.database()

/**
 * 新增
 * @param {String} tableName 表名
 * @param {object} data 数据
 * @returns {Promise<String>} 插入数据的id
 */
async function add(tableName, data) {
	return await db.collection(tableName).add({
		...data,
		create_date: new Date().getTime(),
		update_date: null,
		delFlag: false
	})
}
/**
 * 新增
 * @param {String} tableName 表名
 * @param {object[]} datas 数据数组
 * @returns {Promise<String[]>} 插入数据的id
 */
async function addList(tableName, datas) {
	return await db.collection(tableName).add(datas.map(function (item) {
		item.create_date = new Date().getTime()
		item.update_date = null
		item.delFlag = false
		return item
	}))
}

/**
 * 更新
 * @param {String} tableName 表名
 * @param {string} id 
 * @param {object} data 数据
 * @returns {Promise<String>} 插入数据的id
 */
async function update(tableName, id, data) {
	data.id = null
	return await db.collection(tableName).doc(id).update({
		...data,
		update_date: new Date().getTime()
	})
}

/**
 * 真删除
 * @param {String} tableName 表名
 * @param {String} id 集合id
 * @returns {Promise<Number>} 影响行数
 */
async function deleteReal(tableName, id) {
	return await db.collection(tableName).doc(id).remove()
}

/**
 * 删除
 * @param {String} tableName 表名
 * @param {String} id  集合id
 * @returns {Promise<Number>} 影响行数
 */
async function reomve(tableName, id) {
	return await db.collection(tableName).doc(id).update({
		delFlag: true
	})
}

/**
 * 详情
 * @param {String} tableName 表名
 * @param {String} id  集合id
 * @returns {Promise<object>} 详情
 */
async function info(tableName, id) {
	let res = (await db.collection(tableName).doc(id).get()).data
	return res.length > 0 ? res[0] : null
}

/**
 * 列表
 * @param {String} tableName 表名
 * @param {object} where 查询条件
 * @param {string | object | HBuilderX.DBFieldString} field 字段
 * @param {{String:String}[]} orderBy 排序
 * @returns {Promise<any[]>} 数组
 */
async function list(tableName, where, field, orderBy) {
	let query = db.collection(tableName).where(
		where ? {
			...where,
			delFlag: this.command.in([false, undefined, null])
		} : {
			delFlag: this.command.in([false, undefined, null])
		})
	if (orderBy) {
		orderBy.forEach((element, index, arr) => {
			query.orderBy(...element)
		})
	}
	return (await query.field(field).get()).data
}
/**
 * 分页
 * @param {String} tableName 表名
 * @param {object} where 条件
 * @param {Number} limit 个数
 * @param {Number} currentPage 第几页 
 * @param {string | object | HBuilderX.DBFieldString} field 字段
 * @param {{String:String}[]} orderBy 排序
 * @returns {Promise<{result:object[],total:Number,limit:Number,currentPage:Number}>} 
 **/
async function page(tableName, where, limit, currentPage, field, orderBy) {
	let query = db.collection(tableName).where(where ? {
		...where,
		delFlag: this.command.in([false, undefined, null])
	} : {
		delFlag: this.command.in([false, undefined, null])
	})
	let total = (await query.count()).total
	query = db.collection(tableName).where(where ? {
		...where,
		delFlag: this.command.in([false, undefined, null])
	} : {
		delFlag: this.command.in([false, undefined, null])
	})
	if (orderBy) {
		orderBy.forEach((element, index, arr) => {
			query.orderBy(...element)
		})
	}

	let result = await query.field(field).limit(limit).skip(function () {
		if ((currentPage || 1) > 1) {
			return ((currentPage || 1) - 1) * limit
		} else {
			return 0
		}
	}()).get()
	return {
		result: result.data,
		total,
		limit,
		currentPage: currentPage || 1
	}
}

class BasicRepo {

	/**
	 * 新增
	 * @param {object} data 数据
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<String>} 插入数据的id
	 */
	async add(data, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).add({
			...data,
			create_date: new Date().getTime(),
			update_date: null,
			delFlag: false
		})
	}
	/**
	 * 新增
	 * @param {object[]} datas 数据数组
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<String[]>} 插入数据的id
	 */
	async addList(datas, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).add(datas.map(function (item) {
			item.create_date = new Date().getTime()
			item.update_date = null
			item.delFlag = false
			return item
		}))
	}

	/**
	  * 更新
	  * @param {String} tableName 表名
	  * @param {string} id 
	  * @param {object} data 数据
	  * @param {object} transaction  开启事务用的
	  * @returns {Promise<String>} 插入数据的id
	  */
	async update(id, data, transaction) {
		data.id = null
		return await (transaction ?? this.db).collection(this.tableName).doc(id).update({
			...data,
			update_date: new Date().getTime()
		})
	}

	/**
	 * 真删除
	 * @param {String} id 集合id
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<Number>} 影响行数
	 */
	async deleteReal(id, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).doc(id).remove()
	}

	/**
	 * 删除
	 * @param {String} id  集合id
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<Number>} 影响行数
	 */
	async reomve(id, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).doc(id).update({
			delFlag: true
		})
	}
	/**
	 * 
	 * @param {object} where 
	 * @param {object} transaction 
	 * @returns {Promise<Number>} 
	 */
	async removeWhere(where, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).where(where).update({
			delFlag: true
		})
	}
	/**
	 * 
	 * @param {object} where 
	 * @param {object} transaction 
	 * @returns {Promise<Number>} 
	 */
	async removeRealWhere(where, transaction) {
		return await (transaction ?? this.db).collection(this.tableName).where(where).remove()
	}
	/**
	 * 详情
	 * @param {String} id  集合id
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<any>} 详情
	 */
	async info(id, transaction) {
		let res = (await (transaction ?? this.db).collection(this.tableName).doc(id).get()).data
		return res.length > 0 ? res[0] : null
	}

	/**
	 * 列表
	 * @param {object} where 查询条件
	 * @param {string | object | HBuilderX.DBFieldString} field 字段
	 * @param {{String:String}[]} orderBy 排序
	 * @param {object} transaction  开启事务用的
	 * @returns {Promise<any[]>} 数组
	 */
	async list(where, field, orderBy, transaction) {
		let query = (transaction ?? this.db).collection(this.tableName).where(
			where ? {
				...where,
				delFlag: this.command.in([false, undefined, null])
			} : {
				delFlag: this.command.in([false, undefined, null])
			})
		if (orderBy) {
			orderBy.forEach((element, index, arr) => {
				query.orderBy(...element)
			})
		}
		return (await query.field(field).get()).data
	}
	/**
	 * 分页
	 * @param {object} where 条件
	 * @param {Number} limit 个数
	 * @param {Number} currentPage 第几页 
	 * @param {string | object | HBuilderX.DBFieldString} field 字段
	 * @param {{String:String}[]} orderBy 排序
	 * @param {object} transaction 开启事务用的
	 * @returns {Promise<{result:object[],total:Number,limit:Number,currentPage:Number}>} 
	 **/
	async page(where, limit = 10, currentPage = 0, field = undefined, orderBy = undefined, transaction = undefined) {
		let query = (transaction ?? this.db).collection(this.tableName).where(where ? {
			...where,
			delFlag: this.command.in([false, undefined, null])
		} : {
			delFlag: this.command.in([false, undefined, null])
		})
		let total = (await query.count()).total
		query = this.db.collection(this.tableName).where(where ? {
			...where,
			delFlag: this.command.in([false, undefined, null])
		} : {
			delFlag: this.command.in([false, undefined, null])
		})
		if (orderBy) {
			orderBy.forEach((element, index, arr) => {
				query.orderBy(...element)
			})
		}

		let result = await query.field(field).limit(limit).skip(function () {
			if ((currentPage || 1) > 1) {
				return ((currentPage || 1) - 1) * limit
			} else {
				return 0
			}
		}()).get()
		return {
			data: result.data,
			total,
			limit,
			currentPage: currentPage || 1
		}
	}


	/**
	 * 
	 * @param {(object)=Promise<any>} call 
	 * @returns {Promise<any>}
	 */
	async transaction(call) {
		const collection = await this.db.startTransaction()
		let res
		try {
			res = await call(collection)
		} catch (err) {
			await collection.rollback()
			throw err
		}
		return res
	}
	/**
	 * 
	 * @param {String} tableName 集合名
	 * @param {*} db 云数据库
	 */
	constructor(tableName, db) {
		this.tableName = tableName
		this.db = db || uniCloud.database()
		this.command = this.db.command
	}
}

module.exports = {
	BasicRepo,
	add,
	addList,
	update,
	deleteReal,
	reomve,
	info,
	list,
	page
}