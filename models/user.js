const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum password length is 6 characters"],
    }
})

userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){
        const auth  = await bcrypt.compare(password, user.password)
        console.log(auth)
        if(auth){
            return user
        }else{
            throw Error("Incorrect password")
        }

    }else{
        throw Error("Incorrect email")
    }
   
}

const User = mongoose.model('user', userSchema)

// Mongoose Hooks 
// Wanting to fire the function at a certain event in processing the inputs from the user

// Wanting to fire the function after the document has been saved to the database

module.exports = User