 const User=require("../models/User")
 const mailSender=require("../utils/mailSender") 
const bcrypt=require("bcrypt")
 exports.resetPasswordToken=async(req,res)=>{
 try{

    const email=req.body.email;
    const user =await User.findOne({email:email});
    if(!user){
        return res.status(500).json({
            success:false,
            message:"Your Email is not registered with us"
        })
    }

    const token=crypto.randomUUID();
   
    const updatedDetails=await User.findOneAndUpdate(
        {email:email},{
            token:token,
            resetPasswordToken:Date.now()+5*60*1000
        },
        {new:true}
    )

    const url=`http://localhost:3000/update-password/${token}`
    await mailSender(email,"Password reset Link",`Password Reset Link: ${url}`)

    return res.json({
        success:true,
         message:"Email sent successfully, please check email and change pwd",
    })

}
catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"something went wrong "
    })
}


}

exports.resetPassword=async(req,res)=>{
    try{


         const{Password,confirmPassword,token}=req.body;
    if(Password!==confirmPassword){
              return res.json({
                success:false,
                message:"passoword not matching "
              })
    }

    const userDetails=await User.findOne({token:token});
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        })
    }

    if(userDetails.resetPasswordExpires < Date.now()){
       return res.json({
        success:false,
        message:"Token is expired , please regenerate your token "
       })
    }

     const hashedPassword=await bcrypt.hash(Password,10);
     await User.findOneAndUpdate(
        {token:token},
        {Password:hashedPassword},
        {new :true}
     )
     return res.status(200).json({
        success:true,
        message:"Password reset successfully"
     })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset pwd mail"
        })
    }
   
}