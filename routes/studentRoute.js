const express = require('express');
const { studentRegister, studentLogin, getAllTeachers, addFavoriteTeacher, deleteTeacher, mostFavoriteTeacher, getStudentDetails } = require('../controllers/studentController');
const studentAuth = require('../middlewares/studentAuth');

const router = express.Router();
//BASE URL http://localhost:5000/api/v1/student

//Routes protected with studentAuth need to send recieved jwt token via header
//Adding and Removing Teacher need a valid registered teacher id in query param. 
//To register a teacher make a post request on '/api/v1/teacher/register' 
//with name email password subject in body

router.post('/register',studentRegister);
router.post('/login',studentLogin);
//require token and 

router.get('/allteachers',studentAuth,getAllTeachers); // route to show all availble teacher list to get id

//require jwt token in header to validate user and techerId in query param to add/delete
router.put('/teacher/:teacherId',studentAuth,addFavoriteTeacher);  //optinal - provide scale in body
router.delete('/teacher/:teacherId',studentAuth,deleteTeacher);

router.get('/mostfavourite',studentAuth,mostFavoriteTeacher); //get most favourite teacher by aggregation
router.get('/info',studentAuth,getStudentDetails);  //get detail of logged in user

module.exports = router;

