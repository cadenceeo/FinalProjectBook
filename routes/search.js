const express = require('express');
const router = express.Router();
const path = require('path');
const bookController = require('../controllers/bookController');

//Route Called when User submits search criteria from Home Page
router.route('/')
.get(bookController.getBooks);

module.exports = router;
