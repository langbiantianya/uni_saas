const { BasicRepo } = require('wmSdk')

class RolesRepo extends BasicRepo {
    constructor() {
        super('uni-id-roles')
    }
}
module.exports = { rolesRepo: new RolesRepo(), RolesRepo }