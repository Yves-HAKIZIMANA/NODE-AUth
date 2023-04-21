const jwt = require('jsonwebtoken')
const User =  require("../models/user")
const authorize = (req, res, next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, "I am called cyberKnight", (err, decodedToken) => {
            if(err){
                res.redirect("/login")
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

const checkuser  =   (req, res, next) => {
   const  token = req.cookies.jwt
   if(token){
    jwt.verify(token, "I am called cyberKnight", async (err, decodedToken, req) => {
        if(err){
            console.log(err.message)
            res.locals.user = null
            next()
        }else{
            console.log(decodedToken)
            let user = await User.findById(decodedToken.id)
            console.log(user)
            res.locals.user = user
            next()
        }
    })
}else{
    res.locals.user = null
    next()
}
}

module.exports = {authorize, checkuser}