const Like = require("../models/like.model.js");
const Comment = require("../models/comment.model.js");
const Post = require("../models/post.model.js");
const { validationResult } = require("express-validator");
const { SUCCESS, FAIL, ERROR } = require('../utils/httpStatusText.js');
const asyncWrapper = require("../middleware/asyncWrapper.js");
const appError = require("../utils/appError.js");


const getAllPost = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const posts = await Post.find({}, { "__v": false }).limit(limit).skip(skip);
        res.json({ status: SUCCESS, data: { posts } });
    }
);
const getPost = asyncWrapper(
    async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        if (!post) {
            const error = appError.create("post not found", 404, FAIL);
            return next(error);
        }
        return res.json({ status: SUCCESS, data: post });
    }
);
const createPost = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, FAIL);
            return next(error);
        }
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json({ status: SUCCESS, data: { post: newPost } });
    }
);
const updatePost = asyncWrapper(
    async (req, res) => {
        const id = req.params.id;
        await Post.updateOne({ _id: id }, { $set: { ...req.body } });
        const post = await Post.findById(id).select("-__v");
        return res.status(200).json({ status: SUCCESS, data: { post: post } });
    }
);
const deletePost = asyncWrapper(
    async (req, res) => {
        await Post.deleteOne({ _id: req.params.id });
        await Comment.deleteMany({ postId: req.params.id });
        await Like.deleteMany({ postId: req.params.id });
        res.status(200).json({ status: SUCCESS, data: null });
    }
);



module.exports = {
    getAllPost, getPost, createPost, updatePost, deletePost
}  