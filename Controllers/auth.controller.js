const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const { SUCCESS , FAIL, ERROR } = require("../utils/httpStatusText");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT");


const register = asyncWrapper( 
    async (req , res , next )=>{
        let {username , email , password} = req.body;
        const olduser = await User.findOne({email : email});
        if(olduser){
            const error = appError.create("wrong in something", 400 , FAIL );
            next(error);
        };
        let hashedPassword = await bcrypt.hash(password , 10);
        if(!password){
            hashedPassword = "";
        }else if(password.length < 7){
            hashedPassword = "1";
        }
        const newUser = new User({
            username, email , password : hashedPassword
        });
        const token = await generateJWT({email : newUser.email , id : newUser._id});
        newUser.token = token;
        await newUser.save();
        res.status(201).json({status : SUCCESS , data : {token : token}});
    } 
)


const login = asyncWrapper(
    async (req , res , next) => {
        const {email , password } = req.body;
        if(!email && !password){
            const error = appError.create("email and password are required", 400 , FAIL );
            next(error);
        }
        const user = await User.findOne({email : email});
        if(!user){
            const error = appError.create("wrong in something", 400 , FAIL );
            next(error);
        }
        const matchPassword = await bcrypt.compare(password , user.password);
        if(user && matchPassword){
            const token = await generateJWT({email : user.email , id : user._id});
            return res.json({status : SUCCESS , data : {token , idUser : user._id }});
        }else if(!matchPassword) {
            const error = appError.create("wrong in something", 400 , FAIL );
            next(error);
        }else{
            const error = appError.create("wrong in something", 500 , ERROR );
            next(error); 
        }
    }
);



module.exports = {
    register,login 
}