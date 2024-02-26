const mongoose = require('mongoose');
const path = require('path');
const { stringify } = require('uuid');
const Schema = mongoose.Schema;
const userSchema = require('../model/Users');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new Schema({

    title: {

        type: String,
        required: true
    },
    author: {

        type: String,
        required: true
    },
    coverImageName: {

        type: String,
        
    },
    summary: {

        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
        // rent: {
        //     availability: Boolean,
        //     daysToRent: Number,
        //     waitlist: Number,
        // },
        // buy: {
            
        //     price: Number
        // },
        // owned: {
        //     type: Schema.Types.ObjectId, ref: 'User'
        // },
    },

});

//Helper function to create a property to reference coverImagePath 
//to pull the images from the public/uploads/BookCover path and 
//appends the coverImageName from the specific book to the reference
bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null){

        return path.join('/', coverImageBasePath, this.coverImageName)

    }
})

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
