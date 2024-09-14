const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        minLength : [3 , "the password must be at least 3 characters"]
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : [validator.isEmail , 'filed must be a valid email']
    },
    password : { 
        type :String,
        required :true,
        minLength : [8, "the password must be at least 8 characters"]
    },
    token : {
        type: String
    },
    avatar : {
        type : String ,
        default : '/uploads/profile.png'
    }
})


module.exports = mongoose.model('user', userSchema)