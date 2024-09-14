const { validationResult } = require("express-validator");
const asyncWrapper = require("../middleware/asyncWrapper");
const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const { SUCCESS , FAIL} = require("../utils/httpStatusText");
const appError = require("../utils/appError");


const getAllComment = asyncWrapper(
    async (req,res)=>{
        const query = req.query;
        const limit = query.limit || 10 ;
        const page = query.page || 1;
        const skip = (page -1) * limit ;
        const comments = await Comment.find().limit(limit).skip(skip);
        res.json({status : SUCCESS , data : {comments}});
    }
);

const getAllCommentPost = asyncWrapper(
    async(req, res , next) =>{
        if(!req.params.id){
            const error = appError.create("comments to post not found", 404 , FAIL);
            return next(error);
        }
        const query = req.query;
        const limit = query.limit || 10 ;
        const page = query.page || 1;
        const skip = (page -1) * limit ;  
        const Comments =  await Comment.find({"postId":`${req.params.id}`}).limit(limit).skip(skip);
        // let Comments = [1,2,3,4]
        res.json({status : SUCCESS , data : {Comments}});
    }
);

const getComment = asyncWrapper(
    async (req, res , next) =>{
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            const error = appError.create("comment not found", 404 , FAIL);
            return next(error);
        }
        return res.json({status : SUCCESS , data : comment}); 
    }
);


const createComment = asyncWrapper(
    async (req , res , next)=>{
        const errors = validationResult(req.body);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , FAIL );
            return next(error);
        }
        const newComment = new Comment(req.body);
        await newComment.save();
        const post = await Post.findById(newComment.postId);
        let lenComment = post.lengthComments + 1;
        await post.updateOne({$set : {lengthComments : lenComment}});
        res.status(201).json({status : SUCCESS , data: {comment : newComment}});
    }
);




module.exports = {
    getAllComment, getAllCommentPost, getComment , createComment  
}
