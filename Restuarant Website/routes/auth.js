const express = require("express")
const router = express.Router();
const userController = require('../controllers/users');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
module.exports = router;
