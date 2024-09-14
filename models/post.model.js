const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    content : {
        type : String ,
        required : true
    }, 
    username : {
        type : String,
        required : true
    },
    userId : {
        type : String ,
        required : true
    },
    usernameLikes : {
        type : Array , 
        default : []
    },
    lengthComments :{
        type: Number,
        default : 0
    }
})


module.exports  = mongoose.model("post",postSchema); 