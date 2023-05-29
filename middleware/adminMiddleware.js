const asyncHandler = require('express-async-handler')
const { constants } = require('../utils/constant')

const isRequestDoneByAdmin = (chat, requestorId) => {
    var isAdmin = false
    chat.groupAdmins.forEach(user => {
        if (user._id.equals(requestorId)) {
            isAdmin = true
        }
    })
    return isAdmin
}
const adminProtect = asyncHandler(async(req, res, next) => {
    const { chat } = req.body
    const isAdmin = isRequestDoneByAdmin(chat, req.user._id)
    if (isAdmin) {
        next()
    } else {
        res.status(constants.HTTP_UNAUTHORIZED.code)
        throw new Error(constants.HTTP_UNAUTHORIZED.message)
    }
})

module.exports = { adminProtect, isRequestDoneByAdmin }