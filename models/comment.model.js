const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    content : {
        type : String ,
        required : true
    }, 
    userId : {
        type : String ,
        required : true
    },
    username : {
        type : String ,
        required : true
    },
    postId : { 
        type : String , 
        required : true
    },
    avatar : {
        type : String ,
        required : true
    }
})


module.exports  = mongoose.model("comment" ,  commentSchema);