const router = require('express').Router();

const userController = require('../controller/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getMe', userController.getMe);
router.post('/updateMe', userController.updateMe);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/reset-known-password', userController.resetPasswordKnownPass);

module.exports = router;
