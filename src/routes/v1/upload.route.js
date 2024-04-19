const express = require('express');
const multer = require('multer');

const authController = require('../../controllers/auth.controller');
const uploadController = require('../../controllers/upload.controller');

const upload = require('../../middlewares/multer');

const router = express.Router();


// // Set up multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       // Specify the directory where uploaded files will be stored
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       // Specify the filename for the uploaded file
//       cb(null, file.originalname);
//     }
//   });
  
//   // Create multer instance with the storage configuration
//   const upload = multer({ storage: storage });


router.post('/countryList',  uploadController.countryList);
router.get('/gain-looses',  uploadController.GainLoses);



router.post('/countryListExtractor', upload.single('country'), uploadController.countryList);
// router.post('/login',  authController.login);


module.exports = router;