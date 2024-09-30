const { BasicService, arrayUtils } = require('wmSdk')
const { rolesRepo, RolesRepo } = require('../repo/roles_repo')
const { casbinRuleRepo, CasbinRuleRepo } = require("../repo/casbin_rule_repo")
const { permissionsRepo, PermissionsRepo } = require('../repo/permissions_repo')
const PermissionType = require('../enums/permissions_type')
const { usersRepo, UsersRepo } = require('../repo/users_repo')

class RolesService extends BasicService {
    async add(data) {
        return await this.repo.transaction(async (transaction) => {
            await this.repo.add(data, transaction)
                (await this.permissionsRepo.listByPermissionIds(data.permission, transaction)).forEach(
                    async item => {
                        if (PermissionType.Action.equals(item.type)) {
                            // 添加casbin规则 角色 域 规则 动作
                            await item.actions.forEach(async action => {
                                await this.casbinRuleRepo.add({
                                    ptype: "p",
                                    v0: data.role_id,
                                    v1: data.domains,
                                    v2: action.obj,
                                    v3: action.act
                                }, transaction)
                            })
                        }
                    })
        })
    }

    async update(id, data) {
        return await this.repo.transaction(async (transaction) => {
            // 获取 角色 域 casbin rule
            // 对比原始数据获取变更列表 新增 删除
            let before = await this.repo.info(id)
            if (data.permission) {
                const { added, deleted } = arrayUtils.diff(before.permission, data.permission)
                    (await this.permissionsRepo.listByPermissionIds(added, transaction)).forEach(async item => {
                        if (PermissionType.Action.equals(item.type)) {
                            await item.actions.forEach(async action => {
                                await this.casbinRuleRepo.add({
                                    ptype: "p",
                                    v0: action.role_id,
                                    v1: action.domains,
                                    v2: action.obj,
                                    v3: action.act
                                }, transaction)
                            })
                        }
                    })

                    (await this.permissionsRepo.listByPermissionIds(deleted, transaction)).forEach(async item => {
                        await item.actions.forEach(async action => {
                            if (PermissionType.Action.equals(item.type)) {
                                await this.casbinRuleRepo.removeRealWhere({
                                    ptype: "p",
                                    v0: action.role_id,
                                    v1: action.domains,
                                    v2: action.obj,
                                    v3: action.act
                                }, transaction)
                            }
                        })
                    })
            }
            return await this.repo.update(id, data, transaction)
        })
    }

    async reomve(id) {
        return await this.repo.transaction(async (transaction) => {
            // 根据 角色 域  真删除对应数据
            // 删除这个角色关联的用户的casbin 删除这个角色关联的权限casbin 结合域
            let role = await this.repo.info(id, transaction)
            // 删除 g
            await this.casbinRuleRepo.removeRealWhere({
                ptype: "g",
                v1: role.role_id,
                v2: role.domains
            }, transaction)
            // 删除 p
            await this.casbinRuleRepo.removeRealWhere({
                ptype: "p",
                v0: role.role_id,
                v1: role.domains
            }, transaction)
            // 清理用户关联的角色
            let users = await this.usersRepo.list({
                domains: role.domains,
                role: role.role_id
            }, null, null, transaction)
            users.forEach(async item => {
                await this.usersRepo.update(item._id, {
                    role: item.role.filter(x => x !== role.role_id)
                }, transaction)
            })
            return await this.repo.deleteReal(id, transaction)
        })
    }
    /**
     * 
     * @param {RolesRepo} rolesRepo 
     * @param {CasbinRuleRepo} casbinRuleRepo 
     * @param {PermissionsRepo} permissionsRepo   
     * @param {UsersRepo} usersRepo 
     */
    constructor(rolesRepo, casbinRuleRepo, permissionsRepo, usersRepo) {
        super(rolesRepo)
        this.casbinRuleRepo = casbinRuleRepo
        this.permissionsRepo = permissionsRepo
        this.usersRepo = usersRepo
    }
}

module.exports = { rolesService: new RolesService(rolesRepo, casbinRuleRepo, permissionsRepo, usersRepo), UniIdRolesService: RolesService }