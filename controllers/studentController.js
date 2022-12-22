const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/teacherModel');

const generateToken = (id) => {
    // console.log(process.env.JWT_SECRET_KEY);
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
};

const studentRegister = asyncHandler(async (req,res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({
            message : 'please provide name, email and password'
        })
    }
    const user = await Student.create({name,email,password});
    const token = generateToken(user._id);
    res.status(201).json({
        id:user._id,
        email: user.email,
        password,
        token
    });
})

const studentLogin = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "please add email and password"})
    }
    const user = await Student.findOne({email});
    if(!user) return res.status(404).json({message: "Student not found. Please signup"});
    console.log(user);
    //compare with DB password
    const compare = await bcrypt.compare(password,user.password);
    if(!compare) return res.status(403).json({message: "Invalid password"});
    
    const token = generateToken(user._id);
    res.status(200).json({user,token});
})

const addFavoriteTeacher = asyncHandler(async (req,res)=> {
    const {teacherId} = req.params;
    if(!teacherId) return res.status(400).json({message:'please provide id of teacher'});
    const teacher = await Teacher.findById(teacherId);
    if(!teacher) return res.status(404).json({message: `invalid teacher id`});
    // console.log(req.user);
    const user = await Student.findById(req.user._id).select('-password');
    const find = user.favouriteTeachers.find(item => {
        return item._id.toString() === teacherId;
    });
    if(find) return res.status(400).json({message:"This teacher is already in your favorite list"});
    user.favouriteTeachers.push(teacherId);
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
})

const getAllTeachers = asyncHandler(async (req,res) => {
    const allTeachers = await Teacher.find({}).select('_id name email');
    return res.status(200).json(allTeachers);
})

const deleteTeacher = asyncHandler(async (req,res) => {
    const {teacherId} = req.params;
    if(!teacherId) return res.status(400).json({message:'please provide id of teacher'});
    const teacher = await Teacher.findById(teacherId);
    if(!teacher) return res.status(404).json({message: `invalid teacher id`});
    // console.log(req.user);
    const user = await Student.findById(req.user._id).select('-password');
    const find = user.favouriteTeachers.find(item => {
        return item._id.toString() === teacherId;
    });
    if(!find) return res.status(404).json({message:"This teacher is not in your favourite list"});
    user.favouriteTeachers = user.favouriteTeachers.filter(item => item._id.toString() !== teacherId);
    const updatedUser = await user.save();
    if(!updatedUser) return res.status(500).json({message:"database error"});
    return res.status(200).json({message:'teacher deleted successfully',user:updatedUser});
})

module.exports = {studentLogin,studentRegister,addFavoriteTeacher,getAllTeachers,deleteTeacher}