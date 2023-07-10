const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection = async (req,res)=>{
    try{
    const {sectionName,courseId}=req.body
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Missing Properties"
        })
    }

  const newSection=await Section.create({sectionName})
  const updatedCourseDetails=await Course.findByIdAndUpdate(

    courseId,
    {
        $push:{
            courseContent:newSection._id

        }
    },
    {new:true}
  )
  return res.status(200).json({
    success:true,
    message:"Section created successfully",
    updatedCourseDetails,

  })
}
catch(error){
    return res.status(500).json({
        success:false,
        message:"Unable to create Section, please try again"

    })
}
}

exports.updateSection =async(req,res)=>{
    try{
        const {sectionName,sectionId}=req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
           return res.status(200).json({
            success:true,
            message:"Section updated Successfully"
        })
    }
    catch(error){

        return res.status(500).json({
            success:false,
            message:"Unable to update the section ",
            error:error.message
        })

    }
}

  exports.deleteSection=async(req,res)=>{
    try{
        const {sectionId}=req.params
        await Section.findByIdAndUpdate(sectionId);
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete sectoin plz try again",
            error:message.error
        })
    }
  }