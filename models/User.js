const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('./../utils') // required for hashing password
require('mongoose-type-email')

// schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true    
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String    
  },
  bio: {
    type: String
  },
  accessLevel: {
    type: Number,
    required: true
  },
  newUser: {
    type: Boolean,
    default: true
  },
  favouriteListings: [ // note: [] = an array {} = an object
    { type: Schema.ObjectId, ref: 'Listing' }
]

}, { timestamps: true })

// encrypt password field on save
userSchema.pre('save', function(next) {
  // check if password is present and is modifed  
  if( this.password && this.isModified() ){
    // replace original password with new hashed password
      this.password = Utils.hashPassword(this.password);
  }
  // continue saving user to database
  next()
})

// create model
const userModel = mongoose.model('User', userSchema)

// export model
module.exports = userModel




