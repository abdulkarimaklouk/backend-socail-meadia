const { decode } = require("jsonwebtoken");
const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const { SUCCESS , FAIL} = require("../utils/httpStatusText");



const getAllUser = asyncWrapper(
    async (req,res)=>{
        const query = req.query;
        const limit = query.limit || 10 ;
        const page = query.page || 1;
        const skip = (page -1) * limit ;
        const users = await User.find({} , {"__v" : false , "password" : false}).limit(limit).skip(skip);
        res.json({status : SUCCESS , data : {users}});
    }
);

const getUserToken = asyncWrapper(
    async (req, res , next) =>{
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeader.split(' ')[1];
        const PAYLOAD = decode(token);
        const user = await User.findById(PAYLOAD.id).select("-password");
        if(!user){
            const error = appError.create("user not found", 404 , FAIL);
            return next(error);
        }
        return res.json({status : SUCCESS , data : user}); 
    }
);

const getUser = asyncWrapper(
    async (req, res , next) =>{
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        if(!user){
            const error = appError.create("user not found", 404 , FAIL);
            return next(error);
        }
        return res.json({status : SUCCESS , data : user}); 
    }
);

const updateAvatar = asyncWrapper(
    async (req, res, next) => {
        const file = req.file;
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const token = authHeader.split(' ')[1];
        const PAYLOAD = decode(token);
        const user = await User.findById(PAYLOAD.id).select("-password");
        if(!user){
            const error = appError.create("user not found", 404 , FAIL);
            return next(error);
        }
        file.username = user.username;
        await user.updateOne({avatar : `/uploads/${file.filename}`});
        return res.json({status : SUCCESS , data : user}); 
    }
)


module.exports = {
    getAllUser, getUserToken , getUser , updateAvatar  
}