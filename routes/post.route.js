const express = require("express");

const router = express.Router();

const { validationSChema } = require("../middleware/validation");


const postController = require("../Controllers/post.controller");

const verifyToken = require("../middleware/verifyToken");


router.route('/')
    .get(verifyToken, postController.getAllPost)
    .post(verifyToken, validationSChema(), postController.createPost)


router.route('/:id')
    .get(verifyToken, postController.getPost)
    .patch(verifyToken, postController.updatePost)
    .delete(verifyToken, postController.deletePost);







module.exports = router;