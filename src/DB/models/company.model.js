import mongoose, { mongo } from "mongoose"
import jobModel from "./job.model.js";
import applicationModel from "./application.model.js";

const companySchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    industry:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    numberOfEmployees :{ //[min,max] as a range
        min:Number,
        max:Number
    },
    companyEmail:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Logo:{
        secure_url:String,
        public_id:String
    },
    coverPic:{
        secure_url:String,
        public_id:String
    },
    HRs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    bannedAt:Date,
    deletedAt:Date,
    legalAttachment:{ //pdf or image
        secure_url:String,
        public_id:String
    },
    approvedByAdmin:{
        type:Boolean,
        default:false
    }

},{timestamps:true})


// Middleware to delete jobs & applications when a company is deleted
companySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const companyId = this._id;
    const jobs = await jobModel.find({ company: companyId });
  
    const jobIds = jobs.map((job) => job._id);
    await applicationModel.deleteMany({ job: { $in: jobIds } });
  
    await jobModel.deleteMany({ company: companyId });
  
    next();
  });

const companyModel=mongoose.model('Company',companySchema)
export default companyModel