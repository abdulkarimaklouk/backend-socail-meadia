const Like = require("../models/like.model.js");
const Post = require("../models/post.model.js");
const {SUCCESS , FAIL , ERROR} = require('../utils/httpStatusText.js');
const asyncWrapper = require("../middleware/asyncWrapper.js");


const likesPost = asyncWrapper(
    async (req, res ) => {
        const post = await Post.findById(req.params.idPost);
        const modelLike = await Like.find({postId : req.params.idPost});
        const like = modelLike[0];
        const username = req.body.likeUserName;
        if(!like){
            const newLikesPost = new Like(req.body);
            await newLikesPost.save();
            await newLikesPost.updateOne({$push : { likesPost :  username}});
            await post.updateOne({$push : {usernameLikes : username}});
            const LIKE = await Like.findById(newLikesPost._id);
            return res.status(200).json({status : SUCCESS , data : LIKE});
        }else if(like){
            if(!like.likesPost.includes(username)){
                await like.updateOne({$push : {likesPost : username}}) 
                await post.updateOne({$push : {usernameLikes : username}});
                const LIKE = await Like.findById(like._id);
                return res.status(200).json({status : SUCCESS , data : LIKE});
            }else if(like.likesPost.includes(username)){
                await like.updateOne({$pull : {likesPost : username}}); 
                await post.updateOne({$pull : {usernameLikes : username}});
                const LIKE = await Like.findById(like._id);
                return res.status(200).json({status : SUCCESS , data : LIKE});
            }
        }
    }
);


module.exports = {
    likesPost 
}  