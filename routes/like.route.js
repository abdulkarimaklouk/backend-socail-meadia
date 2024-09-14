const express = require("express");

const router = express.Router();

const likeController = require("../Controllers/like.controller");

const verifyToken = require("../middleware/verifyToken");



router.route('/:idPost')
    .patch(verifyToken , likeController.likesPost);

module.exports = router;