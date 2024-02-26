/**
 * This Controller interacts with out User collection in MongoDB to create a new user
 * 
 */



const User = require('../model/Users');
const bcrypt = require('bcrypt');
const NewUser = async (req, res) => {

    const {username, password} = req.body; //may change depending on HTML
    if(!username || !password) return res.status(400).json({'message':'Username and password required'});

    const duplicate = await User.findOne({username: username}).exec();

    //If the user already exists that means that our database already has a registered account 
    //under that username and the user can attempt to log in using those credentials
    if(duplicate) return res.render('../views/login.ejs', { message: req.session.message = 'Username Already Exists' });

    try{

        // //creates new user
        const newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email = req.body.email;
        newUser.first_name = req.body.fname;
        newUser.last_name = req.body.lname;
        const result = await newUser.save();

        res.render('../views/login.ejs', {message: req.session.message = 'User successfully created. Please Login'});
    
    }catch(error){
        res.status(500).render('../views/login.ejs', {message: req.session.message = 'Failed to create new user'});
    }
}

module.exports = {
    NewUser
}
