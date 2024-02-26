const express = require('express');
const router = express.Router();
const path = require('path');
const supportController = require('../controllers/supportController');

router.get('/', (req, res) => {

     //checks if session user has been assigned or if user has logged in. If no, routes user back to login page to login first
    if(!req.session.user) return res.render(path.join(__dirname, '..', 'views', 'login'), {message: "Please Login Before Submitting a Ticket"} );


    res.render(path.join(__dirname, '..', 'views', 'support')); //with ejs updated to render
    
});

//Register new support ticket. Route called when user hits submit button on Support Page
router.post('/', supportController.NewTicket);

module.exports = router;
