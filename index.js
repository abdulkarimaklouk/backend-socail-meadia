require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const { ERROR } = require('./utils/httpStatusText');
const cors = require("cors");
const url = process.env.MONGO_URL;
const path = require("path");

mongoose.connect(url).then(() => {
    console.log("contect mongodb")
});



app.use(cors({}));


app.use(express.json());



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const postRouter = require("./routes/post.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const commentRouter = require("./routes/comment.route");
const likeRouter = require("./routes/like.route");


app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)
app.use('/api/like', likeRouter);



app.all('*', (req, res, next) => {
    return res.status(404).json({ status: ERROR, message: "this resource is not available" });
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ status: err.statusText || ERROR, data: null, message: err.message, code: err.statusCode || 500 })
})



app.listen(process.env.PORT || 3000, () => {
    console.log("start server port 3000")
})