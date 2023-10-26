const router = require('express').Router()
const userRouter = require('./admin/userRouter')

router.use('/api/user', userRouter)// users router endpoint

module.exports = router