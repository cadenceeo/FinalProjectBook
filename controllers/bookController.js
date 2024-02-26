/**
 * The Book Controller is a compilation of functions exported to our 
 * routes to communcate with our MongoDB collection Books
 * These various functions will interact with the form data submitted 
 * by the user currently logged into the application and respond accordingly
 * 
 * The create, delete, and update book functions all require Administrative or Editor roles to implement 
 * and in our Routes the middleware function verifyRoles is utilized to check
 * our user has these assigned roles before completing an action. 
 */



const Book = require('../model/Books');
const bcrypt = require('bcrypt');
const removeBookCover = require('../middleware/removeBookCover');



const createNewBook = async (req, res) => {

    //file for cover image, if it is equal to null then the file is null
    //req.file is sent from built-in middleware from multi
    const fileName = req.file != null ? req.file.filename : null;



    const duplicate = await Book.findOne({title: req.body.title}).exec();
    if(duplicate) return res.render('../views/books.ejs', {message: 'Book Already Exists'});

    try{
        
        //Create a newBook instance 
        const newBook = new Book();       
        newBook.title = req.body.title;
        newBook.author = req.body.author;
        newBook.summary = req.body.summary;
        newBook.status = req.body.status;
        //for saving image path to database
        newBook.coverImageName = fileName; // jpeg, png, gif accepted file types
        
        //now that our book is successfully created 
        //we will save it to the Database
    
        const result = await newBook.save();
        
        console.log(result); // testing log to verify book created correctly
        res.render('../views/books.ejs', {message: 'Book Successfully added to the database'});
    
    }catch(error){
        if(newBook.coverImageName != null){
        //helper function from middleware to remove image 
        //from saved public/uploads/bookCovers folder    
        removeBookCover(newBook.coverImageName)
        }
        res.status(500)
    }
}

const getBooks = async (req, res) => {
    //Collect query string from HTML form 
    const {search, searchOption} = req.query; //may change depending on HTML
    
    //If nothing was included in the search criteria
    if(!search) return res.status(400).json({'message':'Nothing in Search'});
    
    //if user is searching by Author
    if(searchOption == "author") {
        
    //Fetch existing books in database associated with that author 
    
    
        const BookResult = await Book.find({author: {$regex:search, $options:'i'} });
    //Json response with all the existing results for search criteria
    //Will change to display search criteria
    // res.status(201).json(BookResult);
    
        
        if(BookResult.length === 0) 
        
        {
            res.render('../views/search.ejs', {message: 'There are no books with that author name', BookResults: BookResult});
        }
        else{ res.render('../views/search.ejs', { message: "Books Found", BookResults: BookResult});}
    
    }

    //If the user is searching by title
    else if(searchOption == "title"){
     //Fetch existing books in database associated with that title  
      
    const BookResult = await Book.find({title: {$regex:search, $options:'i'}});

    if(BookResult.length === 0) 
        
    {
        res.render('../views/search.ejs', {message: 'There are no books with that title', BookResults: BookResult});
    

    }
    else{ res.render('../views/search.ejs', { message: "Books Found", BookResults: BookResult});}

    }

    // else{
    //     res.status(201).json({message: "No search results found for given criteria"});
    // }
}

const deleteBook = async (req, res) => {

    // verify information was entered
    if (!req?.body?.title2) return res.status(400).json({ 'message': 'Book title required.' });

    const bookTitle = req.body.title2;

    // search for book in database
    const book = await Book.findOne({ title: bookTitle }).exec();
    if (!book) {
        return res.status(204).json({ "message": `No book found matching title ${req.body.title}.` });
    }
    const result = await book.deleteOne();
    
    //removes bookCover image from public file once deleted 
    removeBookCover(book.coverImageName); 
    //res.json(result);

    res.render('../views/books.ejs', {message: 'Book Successfully Deleted'});
    
    // for testing
    console.log(book + 'deleted')
}

const updateBook = async (req, res) => {
    if (!req?.body?.title3) return res.status(400).json({ 'message': 'Book title required.' });

    const bookTitle = req.body.title3;

    //file for cover image, if it is equal to null then the file is null
    //req.file is sent from built-in middleware from multi
    const fileName = req.file != null ? req.file.filename : null;

    const book = await Book.findOne({ title: bookTitle }).exec();
    if (!book) {
        return res.status(204).json({ "message": `No book found matching title ${req.body.title3}.` });
    }
    //will chain through potential items in document to update. 
    //Currently we are only updating cover picture 
    //will add more later
    try{
    if(fileName) book.coverImageName = fileName;

    const result = await book.save();

    //for testing

    //res.json(result + 'updated');
    
    res.render('../views/books.ejs', {message: 'Book Successfully Updated'});
    


    }catch(error){
        if(newBook.coverImageName != null){
        //helper function from middleware to remove image 
        //from saved public/uploads/bookCovers folder    
        removeBookCover(newBook.coverImageName)
        }
        res.status(500)
    }
    
}

module.exports = {
    createNewBook,
    getBooks,
    deleteBook,
    updateBook
}
