const mongoose = require('mongoose');
const path = require('path');
const { stringify } = require('uuid');
const Schema = mongoose.Schema;

const supportSchema = new Schema({

    Recommendation: {

        type: String,
        
    },
    TechnicalDifficulty: {

        type: String,
        
    },

    userSubmitted: {

        type: String,
    }

});



module.exports = mongoose.model('Support', supportSchema);
