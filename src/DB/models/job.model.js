import mongoose from "mongoose";
import { jobLocation, level, workingTime } from "../../utils/enum/job.enum.js";
import applicationModel from "./application.model.js";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    enum: Object.values(jobLocation),
    required: true,
  },
  workingTime: {
    type: String,
    enum: Object.values(workingTime),
    required: true,
  },
  seniorityLevel: {
    type: String,
    enum: Object.values(level),
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  technicalSkills: {
    type: [String],
  },
  softSkills: {
    type: [String],
  },
  addedBy: {
    //HR in the company
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, 
  updatedBy: {
    //HR in the company (user should be hr)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  },
  closed: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
},{timestamps:true});

jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
});

// Middleware to delete applications when a job is deleted
jobSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const jobId = this._id;
  await applicationModel.deleteMany({ jobId });
  next();
});


const jobModel=mongoose.model('Job',jobSchema)

export default jobModel