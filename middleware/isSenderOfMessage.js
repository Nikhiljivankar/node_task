const asyncHandler = require('express-async-handler')
const { constants, messages } = require('../utils/constant')
const Message = require('../model/messageModel')

const isSenderOfMessage = asyncHandler(async(req, res, next) => {
    const { messageId } = req.body
    if (!messageId) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.FIELDS.FIELDEMPTY)
    }
    const message = await Message.findById(messageId)
    const isSender = message.sender.equals(req.user._id)
    if (!isSender) {
        res.status(constants.HTTP_BAD_REQUEST.code)
        throw new Error(messages.CHAT.NOTSENDEROFMESSAGE)
    }
    next()
})

module.exports = { isSenderOfMessage }