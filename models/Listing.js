// Yoga Teacher Listing model
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils')

// SCHEMA
const listingSchema = new mongoose.Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        // communicates this is linked to the User Model in the database
        // allows us to bring in associated user's details e.g firstName, etc
        ref: 'User' 
    },
    teacherName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    essenceStatement: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    certified: {
        type: Number,
        required: true
    },
    classType: {
        type: String,
        required: true       
    },
    level: {
        type: String,
        required: true
    }

}, { timestamps: true })

// create model
const listingModel = mongoose.model('Listing', listingSchema)

// export model
module.exports = listingModel