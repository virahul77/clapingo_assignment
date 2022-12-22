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
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    password : {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
    },
    favouriteTeachers : [{
        name: {
            type: String,
            required : true,
        },
        subject: {
            type: String,
            required : true,
        },
        teacherId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Teacher",
        },
        scale : {
            type: Number,
            min : [1,'please enter a value within 1-10'],
            max : [10,'please enter a value within 1-10'],
            default : 5
        }
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