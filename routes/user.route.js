const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const userControlle = require("../Controllers/user.controller");

const multer = require('multer');
const appError = require("../utils/appError");



const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName)
    }
})
const fileFilter = (req, file, cb) => {
    const imgType = file.mimetype.split("/")[0];
    if (imgType === "image") {
        return cb(null, true);
    } else {
        return cb(appError.create("file must be an image", 400), false);
    }
}


const upload = multer({
    storage: diskStorage,
    fileFilter
})




router.route('/')
    .get(verifyToken, userControlle.getAllUser)

router.route('/user')
    .get(verifyToken, userControlle.getUserToken)

router.route('/:id')
    .get(verifyToken, userControlle.getUser)

router.route('/avatar')
    .patch(verifyToken, upload.single('avatar'), userControlle.updateAvatar)

module.exports = router;










