require('dotenv').config();
const express = require('express'); 
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500; 
const bodyParser = require('body-parser');
const test = require('./controllers/loginController');
const session = require('express-session');


// connect to mongo database  
connectDB();

// Makes it easier to handle urlencoded & json form data
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());


//set and configure session variable
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

//serve static files for css designs
app.use('/', express.static(path.join(__dirname, '/public')));


//routes
app.use('/', require('./routes/root'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));
app.use('/books', require('./routes/books'));
app.use('/search', require('./routes/search'));
app.use('/support', require('./routes/support'));
app.use('/userShelf', require('./routes/userShelf'));
/*
Added for view engine EJS
*/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', 'register.ejs'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});


//Listen only if MongoDB connects
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    //might need to adjust this depending on how server is built
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
