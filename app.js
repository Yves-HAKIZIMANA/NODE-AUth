const express = require('express')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoute')
const cookieParser = require('cookie-parser')
const  {authorize, checkuser}= require('./middlewares/authMiddleware')

// Setting up the middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


//View Engine
app.set('view engine', 'ejs')

// Connection to the database
const dbURI = 'mongodb://127.0.0.1:27017/NodeAuth'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true}).then((result) => app.listen(890)).catch((err) => console.log(err))

// routes
app.get('*', checkuser)
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', authorize  ,  (req, res) => res.render('smoothies'))
app.use(authRoutes)

app.listen(3000, () => {
    console.log("The app connected to this port 3000")
})

