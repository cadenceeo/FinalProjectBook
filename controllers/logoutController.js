/**
 * The log out Controller does not interact with a specific database collection
 * However it does reset the req.session.user variable to notify our application 
 * that a user is no longer logged into our application. 
 * Certain processes and pages (for security) require a user to be logged in and
 * have certain roles assigned to them
 */

const express = require('express');
const app = express();

//The function logs a user out
const logOut = async (req, res) => {

    //It sets the req.session.user and req.session.role to null to ensure that once a user is logged out 
    //of the application they are no longer able to perform certain functions or access certain pages. 
    req.session.user = null;
    req.session.role = null;
    req.session.save(function (err) {
      if (err) next(err)
  
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      //   req.session.regenerate(function (err) {
      //     if (err) next(err)
      //     res.redirect('/')
      //   })
    })

    req.session.message =  "Thank you! You have successfully logged out";
    
    res.render('../views/logout.ejs' , { message: req.session.message });

};

module.exports = {
    logOut
}
