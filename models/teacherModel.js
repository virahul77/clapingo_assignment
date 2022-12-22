const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');

const teacherSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'name required'],
        trim : true,
    },
    email : {
        type : String,
        required : [true,'email required'],
        trim : true,
        unique : true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    password : {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
    },
    subject : {
        type: String,
        required: [true,'Please add a subject']
    }
},{timestamps:true});


//   Encrypt password before saving to DB
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});


const Teacher = mongoose.model('Teacher',teacherSchema);
module.exports = Teacher;