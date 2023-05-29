const Chat = require('../model/chatModel.js')
const asyncHandler = require('express-async-handler')
const { constants, messages } = require('../utils/constant')
const User = require('../model/user')

const isUserBlocked = async(user1, user2) => {
    for (i = 0; i < user1.blocked.length; i++) {
        if (user1.blocked[i].equals(user2._id)) return true
    }
    for (i = 0; i < user1.blockedBy.length; i++) {
        if (user1.blockedBy[i].equals(user2._id)) return true
    }
    return false
}

const isBlockedChat = asyncHandler(async(req, res, next) => {
    const { chatId } = req.body
    const chat = await Chat.findById(chatId)
    if (chat.isGroupChat) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.CHAT.GROUPCHAT)
    }
    let isBlocked = false
    if (!chat.users[0]._id.equals(req.user._id)) {
        isBlocked = await isUserBlocked(req.user, chat.users[0])
    } else {
        isBlocked = await isUserBlocked(req.user, chat.users[1])
    }
    if (isBlocked) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.USER.BLOCKEDUSER)
    }
    next()
})

module.exports = { isBlockedChat }