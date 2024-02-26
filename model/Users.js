const mongoose = require('mongoose');
const bookSchema = require('../model/Books');
const bcrypt = require('bcrypt'), SALT_WORK_FACTOR = 10; 
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {

        type: String,
        required: true,
        index: {index: {unique: true}}
    },
    role: {
        User: {
            type: Number,
            default: 1001
        },
        Admin: Number,
        Editor: Number
    },
    password: {
        type: String,
        required: true
    },
    first_name: {

        type:String
    },
    last_name: {
        type: String
    },
    //references the books from Model Schema books One to Many as an array of Objects
    bookshelf :[], 

});

/*The following is Built-in Middleware for userSchema to check if password is hashed*/

userSchema.pre('save', function(next){
    let user = this; 

    //only hash the password if it has been modified (or is new)
    if(!user.isModified('password')) return next();

    //generate a salt 
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        //hash the password using the salt
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            //override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//Built-in method with User model to compare the hashed password in the database with the current submission from the user
userSchema.methods.comparePassword = function(candidatePassword) {
    const currentPassword = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, currentPassword, function(err, isMatch){
            if(err) return reject(err);
            resolve(isMatch);
        });
    })
};



module.exports = mongoose.model('User', userSchema);
