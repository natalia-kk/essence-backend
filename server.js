// dependencies------------------------------
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 3000
// allows express server to handle file uploads
const fileUpload = require('express-fileupload') 


// database connection ----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => console.log("db connected!"))
  .catch(err => console.error("db connection failed ", err))


// express app setup -----------------------
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// accept file uploads - set maximum file size (approx 50mb)
app.use('*', cors())
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}))

// ROUTES ---------------------------------
  // set up routes using express app 
  // anyone who goes to /xxxx, use the xxxxRouter

// homepage - dummy route to view on Heroku
app.get('/', (req, res) => {
  res.send("Home")
})

  // auth
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// user
const userRouter = require('./routes/user')
app.use('/user', userRouter)

// listing
const listingRouter = require('./routes/listing')
app.use('/listing', listingRouter) 

// run app listen on port --------------------
    /* actually run the app on a port
        - port variable is set in dependencies - so don't need to enter port number
        - this callback funtion will be fired as soon as app starts running on port
          response will then log in console */
app.listen(port, () => {
  console.log("App running on port ", port)
})