const { BasicRepo } = require('../repo')

class BasicService {
    /**
    * 新增
    * @param {object} data 数据
    * @returns {Promise<String>} 插入数据的id
    */
    async add(data) {
        return await this.repo.add(data)
    }
    /**
    * 新增
    * @param {object[]} datas 数据数组
    * @returns {Promise<String[]>} 插入数据的id
    */
    async addList(datas) {
        return await this.repo.addList(datas)
    }

    /**
    * 更新
    * @param {object} data 数据
    * @returns {Promise<String>} 插入数据的id
    */
    async update(id, data) {
        return await this.repo.update(id, data)
    }

    /**
     * 真删除
     * @param {String} id 集合id
     * @returns {Promise<Number>} 影响行数
     */
    async deleteReal(id) {
        return await this.repo.deleteReal(id)
    }
    /**
     * 删除
     * @param {String} id  集合id
     * @returns {Promise<Number>} 影响行数
     */
    async delete(id) {
        return await this.repo.reomve(id)
    }
    /**
     * 详情
     * @param {String} id  集合id
     * @returns {Promise<object>} 详情
     */
    async info(id) {
        return await this.repo.info(id)
    }
    /**
     * 列表
     * @param {object} where 查询条件
     * @param {string | object | HBuilderX.DBFieldString} field 字段
     * @param {{String:String}[]} orderBy 排序
     * @returns {Promise<any[]>} 数组
     */
    async list(where, field, orderBy) {
        return await this.repo.list(where, field, orderBy)
    }
    /**
     * 分页
     * @param {object} where 条件
     * @param {Number} limit 个数
     * @param {Number} currentPage 第几页 
     * @param {string | object | HBuilderX.DBFieldString} field 字段
     * @param {{String:String}[]} orderBy 排序
     * @returns {Promise<{result:object[],count:Number,limit:Number,currentPage:Number}>} 
     **/
    async page(where, limit, currentPage, field, orderBy) {
        return await this.repo.page(where, limit, currentPage, field, orderBy)
    }
    /**
     * 
     * @param {BasicRepo} repo 
     */
    constructor(repo) {
        this.repo = repo
    }
}

module.exports = BasicService