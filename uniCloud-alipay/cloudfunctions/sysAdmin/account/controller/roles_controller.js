const { BasicController } = require('wmSdk')
const { rolesService, RolesService } = require('../service/roles_service')

// TODO 入参裁剪
class RolesController extends BasicController {
    /**
     * 
     * @param {RolesService} rolesService 
     */
    constructor(rolesService) {
        super(rolesService)
    }
}

module.exports = new RolesController(rolesService)
