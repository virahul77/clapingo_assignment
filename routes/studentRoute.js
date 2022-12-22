const express = require('express');
const { studentRegister, studentLogin, getAllTeachers, addFavoriteTeacher, deleteTeacher } = require('../controllers/studentController');
const studentAuth = require('../middlewares/studentAuth');

const router = express.Router();
//BASE URL http://localhost:5000/api/v1/student

//Routes protected with studentAuth need to send recieved jwt token via header
router.post('/register',studentRegister);
router.post('/login',studentLogin);
router.put('/addteacher/:teacherId',studentAuth,addFavoriteTeacher);
router.get('/allteachers',studentAuth,getAllTeachers);
router.delete('/delteacher/:teacherId',studentAuth,deleteTeacher);

module.exports = router;

