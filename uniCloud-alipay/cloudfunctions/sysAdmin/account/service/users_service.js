const { usersRepo, UsersRepo } = require('../repo/users_repo')
const { BasicService, arrayUtils } = require('wmSdk')
const { casbinRuleRepo, CasbinRuleRepo } = require("../repo/casbin_rule_repo")


class UsersService extends BasicService {
    async update(id, data) {
        data.username = null
        // 比对前后角色的变化与域的变化 有变化就更新casbin规则
        return await this.repo.transaction(async (transaction) => {
            let before = await this.repo.info(id, transaction)
            // 判断域变化 删除全部旧的casbin 规则 添加新域的casbin规则
            if (data.domains && data.domains != before.domains) {
                // 删除全部旧的casbin group       
                await this.casbinRuleRepo.removeRealWhere({
                    ptype: "g",
                    v0: before.username,
                    v2: before.domains
                }, transaction)
                // 添加新的casbin group
                await this.casbinRuleRepo.addList(
                    data.role.map(item => {
                        return {
                            ptype: "g",
                            v0: before.username,
                            v1: item,
                            v2: before.domains
                        }

                    }), transaction)

            } else if (data.role) {
                // 判断角色变化 变更casbin g
                const { added, deleted } = arrayUtils.diff(before.role, data.role)
                deleted.forEach(async item => {
                    await this.casbinRuleRepo.removeRealWhere({
                        ptype: "g",
                        v0: before.username,
                        v1: item,
                        v2: before.domains
                    }, transaction)
                })

                await this.casbinRuleRepo.addList(
                    added.map(item => {
                        return {
                            ptype: "g",
                            v0: before.username,
                            v1: item,
                            v2: before.domains
                        }
                    }), transaction)
            }
            return await this.repo.update(id, data, transaction)
        })
    }
    async reomve(id) {
        // 删除用户后要把casbin g一起删了
        return await this.repo.transaction(async (transaction) => {
            let user = await this.repo.info(id, transaction)
            user.role.forEach(async item => {
                // 删除casbin group 分组
                await this.casbinRuleRepo.removeRealWhere({
                    ptype: "g",
                    v0: user.username,
                    v1: item,
                    v2: user.domains
                }, transaction)
            })
            return await this.repo.deleteReal(id, transaction)
        })
    }
    /**
     * 
     * @param {UsersRepo} usersRepo 
     * @param {CasbinRuleRepo} casbinRuleRepo 18
     */
    constructor(usersRepo, casbinRuleRepo) {
        super(usersRepo)
        this.casbinRuleRepo = casbinRuleRepo
        this.uniIdCo = uniCloud.importObject('uni-id-co')
    }
}

module.exports = { usersService: new UsersService(usersRepo, casbinRuleRepo), UsersService }