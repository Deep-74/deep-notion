const jwt=require("jsonwebtoken")
require("dotenv").config()
const User=require("../models/User");

exports.auth=async(req,res,next)=>{
    try{
          
        const token=req.cookies.token || req.body.token||req.header("Authorisation").replace("Bearer ","");

         
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token in missing"
            })
        }

        try{
                 const decode= jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode)
        req.user=decode;
        }
       
        catch(err){
            
         return res.status(401).json({
           success: false,
           message: "token is invalid",
         });

        }
                next();

    }
    catch(error){
           return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
           })

    }

}


exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accoutType!="Student"){
            return res.status(401).json({
                success:false,
                message:"User role cannot be verified, please try again"

            })
        }
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified , please try again"
        })
    }
}


 