const { BasicRepo } = require('wmSdk')

class DomainsRepo extends BasicRepo {
    constructor() {
        super('wm-domains')
    }
}


module.exports = { domainsRepo: new DomainsRepo(), DomainsRepo }