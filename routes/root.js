const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/home(.html)?', (req, res) => {

    //checks if session user has been assigned or if user has logged in. If no, routes user back to login page to login first
    if(!req.session.user) return res.render(path.join(__dirname, '..', 'views', 'login'), {message: "Please Login"} );

    //assigns user message on Home Page to welcome logged in user
    let user = req.session.user;

    res.render(path.join(__dirname, '..', 'views', 'home'), {user: user, message: ''}); //updated for ejs
});



module.exports = router;
