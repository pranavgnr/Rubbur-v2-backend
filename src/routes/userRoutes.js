const express = require('express');
const router = express.Router();
const bookController = require('../controllers/userController')

router.post('/save',bookController.createBook);
router.get('/getMainBooks', bookController.getBooks);
router.post('/getOtherBooks', bookController.getOtherBooks);
router.post('/updateBook', bookController.updateBook);
router.post('/deleteBook', bookController.deleteBook)

module.exports = router;