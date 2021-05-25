// ROUTES file: listing.js
// fetch requests from ListingAPI (frontend) come here

const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Listing = require('./../models/Listing')
const path = require('path') 

// GET - get a single listing ------------------------------------------------
// (similar to get single user route)
router.get('/:id', Utils.authenticateToken, (req, res) => {
    Listing.findById(req.params.id).populate('user', '_id firstName lastName')
    .then(listing => {
      res.json(listing)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({  // error response sent to user
        message: "Couldn't get listing",
        error: err
      })
    })
})

// GET - get all listings -----------------------------------------------------
    /* 
    .populate('user', '_id firstName lastName') 
    populate: calls ref:user in haircuts model
        - brings in firstName and lastName from user object
        - ie. will fill (populate) the user field with the actual user document (from User collection!
    second field '_id firstName lastName' 
        - determines the specific fields to bring in
        (don't need all the user data)
        (also important for safety: obviously can't include user's password!)
    */

router.get('/', Utils.authenticateToken, (req, res) => {
    Listing.find().populate('user', '_id firstName lastName bio') 
        .then(listings => {
            // if there are no listings - return error message
            if(listings == null){
                return res.status(404).json({
                    message: "No teacher listings found"
                })
            }
            // else, listings exist - return listings
            res.json(listings)
        })
        // catch a problem if there is one
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Problem getting teacher listings"
            })
        })
})

// POST - create a new listing -----------------------------------------------------
router.post('/', (req, res) => {
    // validate  - check that request body isn't empty
    if(Object.keys(req.body).length === 0){   
      return res.status(400).send({message: "Listing content can't be empty"})
    }
    // validate - check if image file exists
    if(!req.files || !req.files.image){
      return res.status(400).send({message: "Image can't be empty"})
    }
  
    console.log('req.body = ', req.body)
  
    // image file must exist. Upload image, then create new listing
    /* upload.File function: upload.File(file, uploadPath, callback) 
       uploadPath = public/images folder 
       callback: returns a uniqueFilename */
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
      // create new listing object (runs once image is uploaded)
      let newListing = new Listing({
        teacherName: req.body.name,
        location: req.body.location,
        essenceStatement: req.body.essenceStatement,
        user: req.body.user,
        image: uniqueFilename,
        gender: req.body.gender,
        certified: req.body.certified,
        classType: req.body.classType,
        level: req.body.level
      })
    
      // save new listing to DB
      newListing.save()
      .then(listing => {        
        // success!  
        // return 201 status with listing object
        return res.status(201).json(listing)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send({
          message: "Problem creating your listing",
          error: err
        })
      })
    })
  })


// export
module.exports = router

// ------------------------------------------------------------------------
/* Syntax:
router.get('/', Utils.authenticateToken, (req,res) => {
    Listing.find().populate('user', '_id firstName lastName')
        .then( => {

        }).catch( => {

        })
})
*/