const mongoose = require('mongoose');
const constants = require("../config/constants");
const CategorySchema = mongoose.Schema({
 
    name: { 
        type: String,
        required: true,
        // unique: true,
        maxLength: 150 
    },

    titleAlt: { 
        type: String,
        maxLength: 250 
    },
    order:{
        type:Number,
        
    },
    image:{
        type:String,
        default:""
    },
    
    slug: { 
        type: String,
        required: true,
        unique: true,
        maxLength: 150 
    },

    status: {
        type: String,
        enum: [constants.CONST_DB_STATUS_ACTIVE, constants.CONST_DB_STATUS_INACTIVE],
        default: constants.CONST_DB_STATUS_ACTIVE
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);