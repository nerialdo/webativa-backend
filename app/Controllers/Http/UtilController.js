'use strict'

class UtilController {
  async tipoUsuario ({ request, response, view, auth }) {
    const user = await User.find(auth.user.id)
    const roles = await user.getRoles()
    const resultRoles = roles[0]
    return resultRoles;
  }
}

module.exports = UtilController
