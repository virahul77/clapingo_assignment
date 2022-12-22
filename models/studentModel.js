const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');

const studendSchema = mongoose.Schema({
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
    favouriteTeachers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        unique : true,
    }]
},{timestamps:true});


//   Encrypt password before saving to DB
studendSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});


const Student = mongoose.model('Student',studendSchema);
module.exports = Student;