const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

const generateToken = (id) => {
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
    // console.log(user);
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
        return item.teacherId.toString() === teacherId;
    });
    if(find) return res.status(400).json({message:"This teacher is already in your favorite list"});
    user.favouriteTeachers.push({
        name: teacher.name,
        teacherId:teacher._id,
        scale : req.body.scale || 5,
        subject: teacher.subject
    });
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
})

const getAllTeachers = asyncHandler(async (req,res) => {
    const allTeachers = await Teacher.find({}).select('_id name email subject');
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
        return item.teacherId.toString() === teacherId;
    });
    if(!find) return res.status(400).json({message:"Teacher not found"});
    user.favouriteTeachers = user.favouriteTeachers.filter(item=> item.teacherId.toString() !== teacherId);
    const updatedUser = await user.save();
    if(!updatedUser) return res.status(500).json({message:"database error"});
    return res.status(200).json({message:'teacher deleted successfully',user:updatedUser});
})

const mostFavoriteTeacher = asyncHandler(async (req,res) => {
    const user = await Student.aggregate([
        {$match : {_id: req.user._id}},
        {$unwind:"$favouriteTeachers"},
        {$sort: {
            "favouriteTeachers.scale" : -1
        }}
    ]);

    if(!user[0]) return res.status(404).json({msg:"no teacher added to favorite"})
    return res.status(200).json(user[0].favouriteTeachers);
})

const getStudentDetails = asyncHandler(async (req,res) => {
    const user = await Student.findById(req.user._id).select('-password');
    res.status(200).json(user);
})


module.exports = {studentLogin,studentRegister,addFavoriteTeacher,getAllTeachers,deleteTeacher,mostFavoriteTeacher,getStudentDetails}