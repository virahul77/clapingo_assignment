const asyncHandler = require("express-async-handler");
// const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");


const studentAuth = asyncHandler(async (req,res,next)=> {
    const token = req.headers.token;
    if(!token) {
        res.status(400);
        throw new Error("Please Login First");
    }

    const verify = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!verify) {
        res.status(400);
        throw new Error("Invalid Token");
    }
    // res.send('verified');
    const user = await Student.findById(verify.id);
    if(!user) {
        res.status(400);
        throw new Error("No User found. Please Register");
    }
    req.user = user;
    next();
})

module.exports = studentAuth;