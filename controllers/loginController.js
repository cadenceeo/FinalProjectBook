/**
 * This Controller interacts with our User database collection 
 * to verify if the individual attempting to log in is an existing user 
 * or needs to create an account. 
 * If the user exist a req.session.user variable is created for that user
 * so our application knows the user is logged in under that username. 
 */
const User = require('../model/Users');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();



const ExistingUser = async (req, res) => {

    

    const {username, password} = req.body; 
    if(!username || !password) return res.status(400).json({'message':'Username and password required'});

    //Fetch existing user from Database 
    const existingUname = await User.findOne({username: username}).exec();

    

     //if User does not exist
    if(!existingUname) return res.render('../views/register.ejs', { message: req.session.message = 'Username Not Found' });


     //Create a variable to validate passwords
    const validatePW = await existingUname.comparePassword(password);

    //if Password does not match 
    if(!validatePW) return res.render('../views/login.ejs', { message: req.session.message =  `Incorrect password` });


    //If Login is successful
    
        //Assigns session veriable user with Username of user instance
        req.session.user = existingUname.username;
        //Assigning session variable to User's assigned roles
        req.session.role = existingUname.role;
    
        res.render('../views/home.ejs', { user: req.session.user, message: '' });

       



    
  

}


module.exports = {

    ExistingUser
}
