const { BasicRepo } = require('wmSdk')

class CasbinRuleRepo extends BasicRepo {
    constructor() {
        super("casbin-rule")
    }
}
module.exports = { casbinRuleRepo: new CasbinRuleRepo(), CasbinRuleRepo }
