const express = require("express");
const router = express.Router();

const commentController = require("../Controllers/comment.controller");
const { validationSChema } = require("../middleware/validation");
const verifyToken = require("../middleware/verifyToken");


router.route('/')
    .post( verifyToken , validationSChema() , commentController.createComment)
    
router.route('/:id')
    .get( verifyToken , commentController.getAllCommentPost)
    
router.route("/comment/:id")    
    .get( verifyToken , commentController.getComment)


module.exports = router;