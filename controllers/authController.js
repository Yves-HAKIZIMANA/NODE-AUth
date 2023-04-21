const User = require('../models/user')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: "", password: ""}

    // duplicate error code
    if(err.code == 11000){
        errors.email = "That email is already registered"
    }

    // Incorrect email 
    if(err.message === "Incorrect email"){
        errors.email = "That email is not registered"
    }

    // Incorrect password
    if(err.message === "Incorrect password"){
        errors.password = "The password is incorrect"
    }
    // validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }
    return errors
}


const maxAge = 3 * 24 * 60 * 60
const createToken  = (id)=>{
    return jwt.sign({id}, 'I am called cyberKnight', {expiresIn: maxAge })
}


const signup_get = async(req, res) => {
    res.render('signup')
}
const login_get = async(req, res) => {
    res.render('login')
}
const signup_post = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.create({email, password})
        const token = createToken(user._id)
        res.cookie('jwt', token, { maxAge : maxAge * 1000, httpOnly : true})
        res.status(201).json({ user : user._id})
        
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
    
    
}
const login_post = async(req, res) => {
    const {email, password} = req.body

    try{
        const user =await  User.login(email,password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { maxAge : maxAge * 1000, httpOnly : true})
        res.status(200).json({ user: user._id})

    } catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
    
}

const logout_get = async(req, res) => {
    // res.cookie('jwt', "", {maxAge: 1})
    res.clearCookie('jwt')
    res.redirect('/')
}

module.exports = {
    signup_get, login_get, signup_post, login_post, logout_get
}