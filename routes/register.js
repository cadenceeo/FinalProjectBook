const express = require('express');
const router = express.Router();
const path = require('path');
const registerController = require('../controllers/registerController');

router.get('/', (req, res) => {
    let message = req.session.message;
    res.render(path.join(__dirname, '..', 'views', 'register'), {message: message} ); //ejs updated to render
});

//Route Called when user submits form from Register Page
router.post('/', registerController.NewUser);


module.exports = router;
