const Course =require("../models/Course")
const Tag =require("../models/tags");
const User =require("../models/User");

const {uploadImageToCloudinary}=require("../utils/imageUploader")
  

exports.createCourse=async(req,res)=>{
    try{
         
        const {courseName, courseDescription,whatYouWillLearn,price,tag}=req.body;

        const thumbnail=req.files.thumbnailImage;

        if(!courseName || 
            !courseDescription|| !whatYouWillLearn ||!price || !tag || !thumbnail ){
                return res.status(400).json({
                    success:false,
                    message:"All fileds are required"
                })
            }
         
            const userId=req.user.id;
            const instructorDetails=await User.findById(userId)
            console.log("INStuctor details :", instructorDetails)

            if(!instructorDetails){
                return res.status(404).json({
                    success:false,
                    message:"Instructor Details not found "
                })
            }
            const tagDetails=await Tag.findById(tag)

            if(!tagDetails){
                return res.status(404).josn({
                    success:false,
                    message:"Tag Details not found"
                })
            }

            const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
            const newCourse = await Course.create(
                {
                    courseName,
                    courseDescription,
                    instructor:instructorDetails._id,
                    whatYouWillLearn:whatYouWillLearn,
                    price,
                    tag:tagDetails._id,
                    thumbnail:thumbnailImage.secure_url

                }
            )
            await User.findByIdAndUpdate({
                _id:instructorDetails._id
            },

              {push:{
                  courses:newCourse._id
              }
            }
            )

            return res.status(200).json({
                success:true,
                message:"Course Created Successfully"
            })
        
        }
    catch(err){
         console.error(err);
         return res.status(500).json({
            success:false,
            message:"failed to create course",
            error:err.message
         })
    }
}

exports.showAllCourses=async(req,res)=> {
    try{
        const allCourses=await Course.find({},{
            courseName :true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true}).populate("instructor").exec();


            return res.status(200).json({
                success:true,
                message:"Date for all courses fetched successfully",
                data:allCourses
            })

        }

    

    catch(error){
        console.log(error);
        return res.staus(500).json({
            success:false,
            message:"cannot fetch course data",
            error:error.message
        })
    }
}