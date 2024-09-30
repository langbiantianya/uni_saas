const { BasicService } = require('wmSdk')
const { domainsRepo, DomainsRepo } = require('../repo/domains_repo')
const { casbinRuleRepo, CasbinRuleRepo } = require("../repo/casbin_rule_repo")

class DomainsService extends BasicService {
    // TODO 删除域的时候把域下面的用户一起删了，再把全部casbin 规则删了
    /**
     * 
     * @param {DomainsRepo} domainsRepo 
     */
    constructor(domainsRepo, casbinRuleRepo) {
        super(domainsRepo)
        this.casbinRuleRepo = casbinRuleRepo
    }
}


module.exports = { domainsService: new DomainsService(domainsRepo, casbinRuleRepo), DomainsService }
