const db = uniCloud.database()

/**
 * 新增
 * @param {String} tableName 表名
 * @param {object} data 数据
 * @returns {String} 插入数据的id
 */
async function add(tableName, data) {
	return await db.collection(tableName).add({
		...data,
		creatAt: new Date().getTime(),
		updateAt: null,
		delFlag: false
	})
}
/**
 * 新增
 * @param {String} tableName 表名
 * @param {object[]} datas 数据数组
 * @returns {String[]} 插入数据的id
 */
async function addList(tableName, datas) {
	return await db.collection(tableName).add(datas.map(function(item) {
		item.creatAt = new Date().getTime()
		item.updateAt = null
		item.delFlag = false
		return item
	}))
}

/**
 * 真删除
 * @param {String} tableName 表名
 * @param {String} id 集合id
 * @returns {Number} 影响行数
 */
async function removeReal(tableName, id) {
	return await db.collection(tableName).doc(id).remove()
}

/**
 * 删除
 * @param {String} tableName 表名
 * @param {String} id  集合id
 * @returns {Number} 影响行数
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
 * @returns {object} 详情
 */
async function info(tableName, id) {
	return await db.collection(tableName).doc(id).get()
}

/**
 * 列表
 * @param {String} tableName 表名
 * @param {object} where 查询条件
 * @param {string | object | HBuilderX.DBFieldString} field 字段
 * @param {{String:String}[]} orderBy 排序
 * @returns {object[]} 数组
 */
async function list(tableName, where, field, orderBy) {
	let query = db.collection(tableName).where({
		...(where || {}),
		delFlag: false
	} || {
		delFlag: false
	})
	if (orderBy) {
		orderBy.forEach((element, index, arr) => {
			query.orderBy(...element)
		})
	}
	return await query.field(field).get()
}
/**
 * 分页
 * @param {String} tableName 表名
 * @param {object} where 条件
 * @param {Number} limit 个数
 * @param {Number} currentPage 第几页 
 * @param {string | object | HBuilderX.DBFieldString} field 字段
 * @param {{String:String}[]} orderBy 排序
 * @returns {{result:object[],count:Number,limit:Number,currentPage:Number}} 
 **/
async function page(tableName, where, limit, currentPage, field, orderBy) {
	let query = db.collection(tableName).where({
		...(where || {}),
		delFlag: false
	})
	let count = await query.count()
	query = db.collection(tableName).where({
		...(where || {}),
		delFlag: false
	})
	if (orderBy) {
		orderBy.forEach((element, index, arr) => {
			query.orderBy(...element)
		})
	}

	let result = await query.field(field).limit(limit).skip(function() {
		if ((currentPage || 1) > 1) {
			return ((currentPage || 1) - 1) * limit
		} else {
			return 0
		}
	}()).get()
	return {
		result,
		count,
		limit,
		currentPage: currentPage || 1
	}
}

const basicRepo = {
	add,
	addList,
	removeReal,
	reomve,
	info,
	list,
	page
}

module.exports = basicRepo