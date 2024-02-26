//Middleware to remove book image from public/uploads/bookCovers folder 
//If Creating book does not properly save or there is an error creating the book
//or if a book is deleted from the database we can remove the image path from 
//our public file
const fs = require('fs');
const path = require('path');
const Book = require('../model/Books');
const uploadPath = path.join('public', Book.coverImageBasePath);

const removeBookCover = (fileName) => {

fs.unlink(path.join(uploadPath, fileName), err => {
    if(err) console.error(err);
})
}

module.exports = removeBookCover;
