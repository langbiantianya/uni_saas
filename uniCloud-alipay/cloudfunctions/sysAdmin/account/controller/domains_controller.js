const { BasicController } = require('wmSdk')
const { domainsService, DomainsService } = require('../service/domains_service')

// TODO 入参裁剪
class DomainsController extends BasicController {
    /**
     * 
     * @param {DomainsService} domainsService 
     */
    constructor(domainsService) {
        super(domainsService,false)
    }
}

module.exports = new DomainsController(domainsService)