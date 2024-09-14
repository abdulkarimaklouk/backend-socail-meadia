const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    postId : {
        type : String ,
        required : true
    },
    likesPost : {
        type: Array,
        default : []
    },
    likeUserName: {
        type : String,
        required : true
    },
})


module.exports = mongoose.model('like', likeSchema);