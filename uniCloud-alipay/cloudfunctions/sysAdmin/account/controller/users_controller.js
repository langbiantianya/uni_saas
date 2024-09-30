const { BasicController } = require('wmSdk')
const { usersService, UsersService } = require('../service/users_service')

// TODO 入参裁剪
class UsersController extends BasicController {
  /**
   * 
   * @param {UsersService} usersService 
   */
  constructor(usersService) {
    super(usersService)

  }

}

module.exports = new UsersController(usersService)