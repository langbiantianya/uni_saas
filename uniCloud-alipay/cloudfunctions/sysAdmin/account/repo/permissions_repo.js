const { BasicRepo } = require('wmSdk')

class PermissionsRepo extends BasicRepo {

    /**
     * 
     * @param {*} permissionIds 权限名称id
     * @param {*} transaction 事务
     * @returns {Promise<any}
     */
    async listByPermissionIds(permissionIds, transaction) {
        return await (transaction ?? this.db).collection(this.tableName).where(
            {
                permission_id: this.command.in(permissionIds)
            }
        ).get()
    }

    constructor() {
        super('uni-id-permissions')
    }
}

module.exports = { permissionsRepo: new PermissionsRepo(), PermissionsRepo }