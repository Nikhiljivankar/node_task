const { constants, messages } = require('../utils/constant')
const Chat = require('../model/chatModel')
const asyncHandler = require('express-async-handler')

const isGroupChat = asyncHandler(async(req, res, next) => {
    const { chatId } = req.body
    const chat = await Chat.findById(chatId)
    if (!chat) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(constants.HTTP_BAD_REQUEST.message)
    }
    if (!chat.isGroupChat) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.CHAT.NOTGROUPCHAT)
    }
    req.body.chat = chat
    next()
})

module.exports = { isGroupChat }