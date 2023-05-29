const asyncHandler = require('express-async-handler')
const { constants, messages } = require('../utils/constant')
const Chat = require('../model/chatModel')

const isMemberOfChat = asyncHandler(async(req, res, next) => {
    const { chatId } = req.body
    if (!chatId) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.FIELDS.FIELDEMPTY)
    }
    const chat = await Chat.findById(chatId)
    const isMember = chat.users.find(user => user._id.equals(req.user._id))
    if (!isMember) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.CHAT.CHATMEMBERFAILURE)
    }
    next()
})

module.exports = { isMemberOfChat }