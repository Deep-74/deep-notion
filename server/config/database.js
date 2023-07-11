const mongoose=require('mongoose');
require("dotenv").config();


exports.connect=()=>{
    mongoose.connect(Proceess.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("DB Connected Successfully")})
    .catch((error)=>{
        console.log("DB connection failed")
        procees.exit(1);
    })
}