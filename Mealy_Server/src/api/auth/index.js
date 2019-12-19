const router = require('express').Router();
const authCtrl = require('./auth.ctrl');

router.route('/login').post(authCtrl.login);
router.route('/signup').post(authCtrl.signUp);

module.exports = router;
