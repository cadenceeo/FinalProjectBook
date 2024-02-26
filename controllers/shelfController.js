/**
 * This Controller interacts with both our User and Book database collections in MongoDB
 * to add, remove, and retrieve the books from a User's favorites list 
 * 
 */

const Book = require('../model/Books');
const User = require('../model/Users');
const path = require('path');
const { default: mongoose } = require('mongoose');



//adds a book to user bookshelf
const addBookToShelf = async (req, res) => {

    //if user is not logged in return user to login page
    if(!req.session.user) return res.render(path.join(__dirname, '..', 'views', 'login'), {message: "Please Login"} );

    //grab bookId of select book from HTML form
    const {bookId, bookResult } = req.body;

    //modifies our list of bookResults to an array
    const bookArr = bookResult.split(",");

    let newBookArr = [];

    //Loops through the bookArr item and adds it to our
    //newBookArr to create a cleaner array of objects
   bookArr.forEach((item) => {

    newBookArr.push(mongoose.Types.ObjectId(item));
   })

    //initialize an instance of the book from the Book Database
    const book = await Book.findById(bookId).exec();
    if (!book) {
        return res.status(204).json({ "message": `No book found matching id ${bookId}.` });
    }

    
    const usernm = req.session.user;

    //create an instance of the user to add the new book title to bookshelf
    const user = await User.findOne({username: usernm}).exec();

    if (!user) {
        return res.status(204).json({ "message": `No user found matching username ${usernm}.` });
    }

    
    let testValue = false;
    
    //Find if book already exists users bookShelf
    user.bookshelf.forEach((item) => {

        //loop through items to check each value already in user shelf
        for(let key in item){
            //if the value is found
            if(item[key].toString() == bookId){
                //set testValue to true
                testValue = true;
            }
        }
        
    });

    //Find the books that are in our Book collection with the id's of the newBookArr we created
    //This allows our application to reload the search page with all the books the user had
    //previously searched for before adding the selected book to their personal shelf 

    const bookResults = await Book.find({"_id" : {"$in" : newBookArr}});

    
    //if the testValue is true then the book already exists in the users bookshelf. Returns appropriate message
    if(testValue) return res.render('../views/search.ejs', {BookResults:bookResults, message:`Book already exists on ${req.session.user}'s Shelf`});

    try{
    //if the book exists in the Book database add the book
    //to the user shelf    
    if(book) user.bookshelf.push(book);

    const result = await user.save();

   
    return res.render('../views/search.ejs', {BookResults: bookResults, message:`Book Successfully Added to ${req.session.user}'s Shelf`})


    }catch(error){

        res.status(500)
    }
    
}

//retrieves the user shelf of books
const getUserShelf = async (req, res) => {

    //checks if the user is currently logged in. If not, returns user to login page and requests user to log in
    if(!req.session.user) return res.render(path.join(__dirname, '..', 'views', 'login'), {message: "Please Login"} );


    const usernm = req.session.user;


    const user = await User.findOne({username: usernm}).exec();

    if (!user) {
        return res.status(204).json({ "message": `No user found matching username ${usernm}.` });
    }

    //Creates a list of objects with the users current bookshelf
    const userShelf = user.bookshelf;

    let idArr = [];

    //Loop through the userShelf array to create a list of Book Id's 
    userShelf.forEach((item) => {

        for(let key in item){
            if(key == '_id'){

                idArr.push(item[key]);
            }
        }
        
    });

    //Retrieves the list of books in our Books collection to return a list of book objects
   const bookResult = await Book.find({"_id" : {"$in" : idArr}});

    //loads the userShelf page with the list of books associated with that user's personal array of book
    res.render('../views/userShelf.ejs', {user: req.session.user, message: " ", BookResults: bookResult});



}

const removeFromShelf = async (req, res) => {

    if(!req.session.user) return res.render(path.join(__dirname, '..', 'views', 'login'), {message: "Please Login"} );

    const usernm = req.session.user;

    let bookId = req.body.bookId;

    const user = await User.findOne({username: usernm}).exec();

    if (!user) {
        return res.status(204).json({ "message": `No user found matching username ${usernm}.` });
    }


        let testValue = false;
        
        let i = 0;
        let index = 0;
        //Find whether book exists user's bookShelf
        //returns the index of the book to remove from user's current array of books
        user.bookshelf.forEach((item) => {

            
            for(let key in item){
                if(item[key].toString() == bookId){
                    
                    testValue = true;
                    index = i;
                }
            }
            i++

            
        });
        //if the testValue is false then the book already exists in the users bookshelf
        if(!testValue) return res.render('../views/search.ejs', {message:`Book does not exist on ${req.session.user}'s shelf`});
    
    
    try{
        
        
        //removes book from user bookShelf at assigned index
        user.bookshelf.splice(index,1);

    
        const result = await user.save();




//reloads shelf without book listed
        
    const userShelf = user.bookshelf;

    let idArr = [];

    userShelf.forEach((item) => {

        for(let key in item){
            if(key == '_id'){

                idArr.push(item[key]);
            }
        }
        
    });

    //Finds results of existing books in the UserShelf (minus the removed book) in Book collection
    const bookResult = await Book.find({"_id" : {"$in" : idArr}});

    //Reloads the page so the user can view their shelf without the book they just removed from their shelf. 
    return res.render('../views/userShelf.ejs', {user: req.session.user, message: "Book Successfully Removed from Shelf ", BookResults: bookResult});
       
        }catch(error){
    
            res.status(500)
        }


}

module.exports = {
    addBookToShelf,
    getUserShelf,
    removeFromShelf
}
