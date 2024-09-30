const { BasicController } = require('wmSdk')
const { permissionsService, PermissionsService } = require('../service/permissions_service')

// TODO 入参裁剪
class PermissionsController extends BasicController {
    /**
     * 获取自己的路由
     */
    async getMyRoutes(ctx) {
        let body = ctx.body
        return await this.service.getMyRoutes(ctx.user,body.data)
    }
    /**
     * 
     * @param {PermissionsService} permissionsService 
     */
    constructor(permissionsService) {
        super(permissionsService)
    }
}

module.exports = new PermissionsController(permissionsService)