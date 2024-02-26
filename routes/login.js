const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controllers/loginController');

router.get('/', (req, res) => {
    
    res.render(path.join(__dirname, '..', 'views', 'login'), {message: ' '}); //with ejs updated to render
    
});

//route called when user submits Login Form
router.post('/', loginController.ExistingUser);

module.exports = router;
