const dotenv = require('dotenv');
dotenv.config(); //intialise valiables first

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoute = require('./routes/studentRoute');
const teacherRoute = require('./routes/teacherRoute');
const errorHandler = require('./middlewares/errorMiddleware');


//Middlewares
app.use(express.json());
app.use(cors());


//Routes Middleware
app.use('/api/v1/student',studentRoute);
app.use('/api/v1/teacher',teacherRoute);



//handle errors
app.use(errorHandler);

//Connect to DB then start server
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI).then(conn => {
    console.log(`connected to DB successfully`,conn.connection.host);
    app.listen(PORT,() =>{
        console.log(`server listening at port ${PORT}`);
    })
}).catch((err)=>{
    console.log('DB connection failed');
    console.log(err);
    process.exit();
})

