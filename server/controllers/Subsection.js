const  SubSection=require("../models/");
const Section=require("../models/Section");

exports.createSubSection =async (req,res)=>{
    try{
        const {sectionId,title,timeDuration,description}=req.body;

        const video= req.files.videoFile;

        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const uploadDetails=await uploadImageToCloudinary(video,proces.env.FOLDER_NAME);

        const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_Url
        })
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
            {$push:{
                subSection:SubSectionDetails._id
            }},{new:true}

        )

        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection
        })

    }
    catch(error){
       return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:error.message
       })
    }
}
//update section
// delete section