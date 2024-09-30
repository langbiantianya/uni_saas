const { BasicRepo } = require('wmSdk')


class UsersRepo extends BasicRepo {
    constructor() {
        super("uni-id-users")
    }
}

module.exports = { usersRepo: new UsersRepo(), UsersRepo }  