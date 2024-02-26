/**
 * This Controller interacts with our Support collection database in MongoDB
 * Allowing users who are logged in to submit Book Recommendations to add to the 
 * Book Collection database and also submit Technical Support tickets. 
 */


const Support = require('../model/Support');
const User = require('../model/Users');


const NewTicket = async (req, res) => {

    const {recommend, tech} = req.body; 
    
    const user = await User.find({username: req.session.user}).exec();

    
    //If neither the recommend or technical support section is filled out it returns the user a message that they need at least one to submit a ticket
    if(!recommend && !tech) return res.status(400).json({'message':'Please enter a recommendation or Technical Difficulty'});


    try{

        const newTicket = new Support();
        //If a recommendation exists add that to the new instatiated Ticket
        if(recommend) newTicket.Recommendation = recommend;
        //If a technical support question exists, add that to the new instatiated Ticket
        if(tech) newTicket.TechnicalDifficulty = tech;
        //Check if the user exists in the database and assign the username to the new Ticket for reference
        if(user) newTicket.userSubmitted = req.session.user;
        const result = await newTicket.save();

        //Return user back to their home page with Ticket successfully created message
        res.render('../views/home.ejs', {user: req.session.user, message: req.session.message = 'Ticket successfully created'});
    
    }catch(error){
        res.status(500).render('../views/home.ejs', {user: req.session.user, message: req.session.message = 'Failed to create ticket'});
    }
}

module.exports = {
    NewTicket
}
