// const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Teacher = require('../models/teacherModel');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
};

const teacherRegister = asyncHandler(async (req,res) => {
    // res.send("register route");
    const {name,email,password,subject} = req.body;
    if(!name || !email || !password || !subject) {
        return res.status(400).json({
            message : 'please provide name, email, password and subject'
        })
    }
    const existing = await Teacher.findOne({email});
    if(existing) return res.status(400).json({message: "email already registered"});
    const teacher = await Teacher.create({name,email,password,subject});
    if(!teacher) return res.status(500).json({message:"Database Error"});
    const token = generateToken(teacher._id);
    res.status(201).json({
        id: teacher._id,
        name : teacher.name,
        email:teacher.email,
        password,
        subject: teacher.subject,
        token
    });
})

module.exports = {teacherRegister}