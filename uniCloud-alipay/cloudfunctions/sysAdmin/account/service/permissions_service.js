const { BasicService } = require('wmSdk')
const { permissionsRepo, PermissionsRepo } = require('../repo/permissions_repo')
const { casbinRuleRepo, CasbinRuleRepo } = require("../repo/casbin_rule_repo")
const { rolesRepo, RolesRepo } = require('../repo/roles_repo')
const PermissionType = require("../enums/permissions_type")

class PermissionsService extends BasicService {
    /**
     * 获取自己的路由
     */
    async getMyRoutes(user, ctx) {
        if (user.domains !== "superAdmin" && !user.role.includes("superAdmin")) {
            let roles = await this.rolesRepo.list({ domains: user.domains, role_id: this.rolesRepo.command.in(user.role) })
            return await this.repo.list({ permission_id: this.repo.command.in(roles.map(item => item.permission).flat()) }, { comment: true, parent_id: true, permission_id: true, permission_name: true, _id: true })
        }
        return await this.repo.list({}, { comment: true, parent_id: true, permission_id: true, permission_name: true, _id: true, type: true })
    }
    async remove(id, transaction) {
        const del = async (transaction) => {
            let permission = await this.repo.info(id)
            // 删除role的permission
            let roles = await this.rolesRepo.list({
                permission: permission.permission_id
            }, null, null, transaction)

            roles.forEach(async role => {
                await this.rolesRepo.update(role._id, {
                    permission: role.permission.filter(item => {
                        return item !== permission.permission_id
                    })
                }, transaction)
            })

            // 删除casbin的p
            if (PermissionType.Action.equals(permission.type)) {
                permission.actions.forEach(async action => {
                    await this.casbinRuleRepo.removeRealWhere({
                        ptype: "p",
                        v2: action.obj,
                        v3: action.act
                    }, transaction)
                })

            }
            let childs = await this.permissionsRepo.list({
                parent_id: permission.permission_id
            }, null, null, transaction)

            // 找到子节点一起删除
            childs.forEach(child => {
                remove(child._id, transaction)
            })
            return await this.repo.deleteReal(id, transaction)
        }

        if (transaction) {
            return await del(transaction)
        } else {
            return await this.repo.transaction(async (transaction) => {
                return await del(transaction)
            })
        }
    }

    /**
     * 
     * @param {PermissionsRepo} permissionsRepo 
     */
    constructor(permissionsRepo, casbinRuleRepo, rolesRepo) {
        super(permissionsRepo)
        this.casbinRuleRepo = casbinRuleRepo
        this.rolesRepo = rolesRepo
    }
}


module.exports = { permissionsService: new PermissionsService(permissionsRepo, casbinRuleRepo, rolesRepo), PermissionsService }


