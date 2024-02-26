const express = require('express');
const router = express.Router();
const path = require('path');
const logoutController = require('../controllers/logoutController');

router.get('/', (req, res) => {
    let message = req.session.message;
    res.render(path.join(__dirname, '..', 'views', 'logout'), {message: message}); //updated for ejs
});


//Route Called when user selects Logout Button from Home Page
router.post('/', logoutController.logOut);

module.exports = router;
