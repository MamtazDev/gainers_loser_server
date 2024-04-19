const express = require('express');
const authController = require('../../controllers/auth.controller');
const uploadController = require('../../controllers/upload.controller');

const router = express.Router();

router.post('/countryList', uploadController.countryList);
// router.post('/login',  authController.login);


module.exports = router;