import applicationModel from "../../DB/models/application.model.js";
import companyModel from "../../DB/models/company.model.js";
import jobModel from "../../DB/models/job.model.js";
import { asyncHandler, eventEmitter } from "../../utils/index.js";
import cloudinary from "../../utils/cloudinary/index.js";

//1.add job
export const createJob = asyncHandler(async (request, response, next) => {
  const company = await companyModel.findById(request.body.companyId);
  if (!company || company.deletedAt) {
    return next(new Error("Company doesn't exist.", { cause: 404 }));
  }

  //check if the user is the company owner or is in the hr list
  if (
    request.user._id.toString() !== company.createdBy.toString() &&
    !company.HRs.includes(request.user._id)
  ) {
    return next(new Error("Don't have the access.", { cause: 404 }));
  }

  const job = await jobModel.create(request.body);
  job.addedBy = request.user._id;
  await job.save();
  return response.status(200).json({ message: "Job added", job });
});

//2. update job
export const updateJob = asyncHandler(async (request, response, next) => {
  const { jobId } = request.params;
  const job = await jobModel.findById(jobId);

  if (!job) {
    return next(new Error("Job doen't exist", { cause: 404 }));
  }

  if (job.addedBy.toString() != request.user._id.toString()) {
    return next(new Error("Don't have access", { cause: 400 }));
  }
  await jobModel.updateOne({ _id: jobId }, request.body);

  return response.status(200).json({ message: "Job updated" });
});

//3. delete job
export const deletejob = asyncHandler(async (request, response, next) => {
  const { jobId } = request.params;
  const job = await jobModel.findById(jobId);
  if (!job) {
    return next(new Error("Job doen't exist", { cause: 404 }));
  }

  const companyId = job.companyId;
  const company = await companyModel.findById(companyId);
  if (!company.HRs.includes(request.user._id)) {
    return next(new Error("Don't have access, should be HR", { cause: 400 }));
  }

  await jobModel.deleteOne({ _id: jobId });

  return response.status(200).json({ message: "Job deleted" });
});

//4.Get all Jobs or a specific one for a specific company
export const getORSearch = asyncHandler(async (request, response, next) => {
  const { companyId } = request.params;
  const { search, skip = 0, limit = 10 } = request.query;
  let query = {};
  // Search for company by name if 'search' is provided
  if (search) {
    const company = await companyModel.findOne({ companyName: search });
    if (!company) {
      return response.status(404).json({ message: "Company not found" });
    }
    query.companyId = company._id;
  }
  //if companyId is provided
  if(companyId){
    query.companyId=companyId
  }

  const jobs = await jobModel.find(query)
    .populate("companyId")
    .skip(skip)
    .limit(limit)
    .sort("createdAt");

    const totalJobs = await jobModel.countDocuments(query);


  return response.status(200).json({ totalCount:totalJobs,jobs });
});

//5. get all jobs if no filters applied
export const getwithfilter = asyncHandler(async (request, response, next) => {
  const { skip = 0, limit = 10, workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = request.query;
  let filter={}

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: 'i' }; 
  if (technicalSkills) {
      filter.technicalSkills = { $in: technicalSkills.split(',') };
  }

  const jobs = await jobModel.find(filter)
  .sort("createdAt")
  .skip(skip)
  .limit(limit);

const totalJobs = await jobModel.countDocuments(filter);

return response.status(200).json({ totalcount:totalJobs, jobs });

});

//6. get all applications
export const getapplications=asyncHandler(async(request,response,next)=>{
    const { skip = 0, limit = 10}=request.query
    const {jobId}=request.params
    const job=await jobModel.findById(jobId)
    if(!job){
        return next(new Error("Job is not found",{cause:404}))
    }
    const company=await companyModel.findById(job.companyId)

    if( request.user._id.toString() !== company.createdBy.toString() &&
    !company.HRs.includes(request.user._id)){
    return next(new Error("Don't have the access.", { cause: 404 }));
    }
    
    const applications=await applicationModel.find({jobId})
    .populate('userId').skip(skip)
    .limit(limit);
    return response.status(200).json({applications})
})


//7. Apply to job
export const jobApplication=asyncHandler(async(request,response,next)=>{
    const{jobId}=request.params
     if(!await jobModel.findById(jobId)){
      return next(new Error("Job is not found",{cause:404}))
     }

     if(!request.file){
       return next(new Error("Please upload your CV"))
     }

     const { secure_url, public_id } = await cloudinary.uploader.upload(
      request.file.path,
      {
        folder: "exam/cvs",
      }
    );

    const application=await applicationModel.create({
      jobId,
      userId:request.user._id,
      userCV:{secure_url,public_id}
    })
    return response.status(200).json({message:"Application sent",application})
})

//8. accept or reject an applicant
export const hremail=asyncHandler(async (request,response,next)=>{
    const {applicationId,status}=request.body
    //get the application
    const application=await applicationModel.findById(applicationId)
    if(!application){
      return next(new Error("Application not found"))
    }
 
    //get the job with jobId 
    const job=await jobModel.findById(application.jobId)
    //get the company from job
    const company=await companyModel.findById(job.companyId)
   //check that the authenticated user is an hr in the desired company
    if(!company.HRs.includes(request.user._id.toString())){
      return next(new Error("Acces denied"))
    }
    
    eventEmitter.emit("applicationEmail",{userId:application.userId,status})

    return response.status(200).json({message:"Done"})
})