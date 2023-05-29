const asyncHandler = require('express-async-handler')

const paginate = asyncHandler(async(req, res, next) => {
    const { page, limit } = req.query
    if (!page || page < 1) req.query.page = 1
    if (!limit || limit <= 0) req.query.limit = 10
    req.query.page = parseInt(req.query.page)
    req.query.limit = parseInt(req.query.limit)
    next()
})

module.exports = { paginate }