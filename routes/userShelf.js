const express = require('express');
const router = express.Router();
const path = require('path');
const shelfController = require('../controllers/shelfController');
const { route } = require('./root');

//Route called when user selects viewUser Favorites Button on Home Page
router.get('/', shelfController.getUserShelf);

//Route Called when user selects "add Book" from search result page on selected Book
router.post('/add', shelfController.addBookToShelf);

//Route Called when user selects "remove Book" from userShelf page on select Book
router.post('/remove', shelfController.removeFromShelf);




module.exports = router;
