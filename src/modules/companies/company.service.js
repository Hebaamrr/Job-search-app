import companyModel from "../../DB/models/company.model.js";
import jobModel from "../../DB/models/job.model.js";
import cloudinary from "../../utils/cloudinary/index.js";
import {asyncHandler } from "../../utils/index.js";

//1. add company
export const createCompany=asyncHandler(async(request,response,next)=>{
     const {companyName,address,companyEmail,HRs,numberOfEmployees}=request.body
     if(await companyModel.findOne({companyEmail}) || await companyModel.findOne({companyName})){
        return next(new Error("email or name are reserved.",{cause:409}))
     }

     const company=await companyModel.create({
        companyName,
        companyEmail,
        address,HRs,numberOfEmployees,
        createdBy:request.user._id
     })
  return response.status(201).json({message:"Company added",company})
})

//2. update company data
export const updateCompany=asyncHandler(async(request,response,next)=>{
 
    const{companyId}=request.params
    const company=await companyModel.findById(companyId)

    if(company.deletedAt || !company){
        return next(new Error("Company doesn't exist.",{cause:404}))
    }
    if(company.createdBy.toString() != request.user._id.toString()){
        return next(new Error("This action cannot be happened, you are not the owner",{cause:400}))
    }

    if(request.body.legalAttachment){
        return next(new Error("Legal attachments cannot be updated",{cause:400}))
    }
 
    await companyModel.updateOne({_id:companyId},request.body)
 return response.status(200).json({message:"Company updated"})
})

//3. soft delete company
export const softDeleteCompany=asyncHandler(async(request,response,next)=>{
 
    const{companyId}=request.params
    const company=await companyModel.findById(companyId)
    if(company.deletedAt || !company){
        return next(new Error("Company doesn't exist.",{cause:404}))
    }
    
    if(company.createdBy.toString() != request.user._id.toString() || request.user.role != "Admin"){
        return next(new Error("This action cannot be happened, no access",{cause:400}))
    }

 
    await companyModel.updateOne({_id:companyId},{deletedAt:Date.now()})
 return response.status(200).json({message:"Company deleted"})
})

//4. get company with jobs
export const getcompanywithjobs=asyncHandler(async (request,response,next)=>{
   const {companyId}=request.params
   const jobs=await jobModel.find({companyId}).populate("companyId")
   if(jobs.length==0){
    return next(new Error("No jobs assigned to this company",{cause:404}))
   }
   return response.status(200).json({jobs})
})


//5. search with name
export const searchbyname=asyncHandler(async(request,response,next)=>{
 
    const {companyName}=request.body
    const company=await companyModel.findOne({companyName})
    if(!company || company.deletedAt){
   return next(new Error("Company not found",{cause:404}))
    }
 return response.status(200).json({message:"Company found",company})
})

//6. upload company logo
export const uploadLogo = asyncHandler(async (request, response, next) => {

    const {companyId}=request.params
    const company=await companyModel.findById(companyId)

    if(!company || company.deletedAt){
        return next(new Error("Company not found",{cause:404}))
    }

    if(company.createdBy.toString() != request.user._id.toString()){
        return next(new Error("This action cannot be happened, you are not the owner",{cause:400}))
    }

    if (!request.file) {
      return next(new Error("Please upload an image", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      request.file.path,
      {
        folder: "exam/companyLogo",
      }
    );
    await companyModel.updateOne(
      {_id:companyId },
      { Logo: { secure_url, public_id } }
    );
    
    return response.status(200).json({ message: "Company Logo uploaded" });
  });

  //7. upload cover pic
  export const uploadCoverpic = asyncHandler(async (request, response, next) => {

    const {companyId}=request.params
    const company=await companyModel.findById(companyId)

    if(!company || company.deletedAt){
        return next(new Error("Company not found",{cause:404}))
    }

    if(company.createdBy.toString() != request.user._id.toString()){
        return next(new Error("This action cannot be happened, you are not the owner",{cause:400}))
    }

    if (!request.file) {
      return next(new Error("Please upload an image", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      request.file.path,
      {
        folder: "exam/companyCoverPic",
      }
    );
    await companyModel.updateOne(
      {_id:companyId },
      { coverPic: { secure_url, public_id } }
    );
    
    return response.status(200).json({ message: "Company cover pic uploaded" });
  });
  
  //8. Delete Company logo
  export const deleteLogo = asyncHandler(
    async (request, response, next) => {
      
    const {companyId}=request.params
    const company=await companyModel.findById(companyId)

    if(!company || company.deletedAt){
        return next(new Error("Company not found",{cause:404}))
    }

    if(company.createdBy.toString() != request.user._id.toString()){
        return next(new Error("This action cannot be happened, you are not the owner",{cause:400}))
    }
    if(!company.Logo.public_id){
      return next(new Error("Logo don't exist",{cause:400}))
    }
      //delete the existing image from public_id
      await cloudinary.uploader.destroy(company.Logo.public_id);
  
   await companyModel.updateOne(
        { _id: companyId},
        { $unset: { Logo: 0 } }
      );
  
      return response.status(200).json({ message: "Compnay Logo deleted" });
    }
  );

   //9. Delete Company cover
   export const deletecover = asyncHandler(
    async (request, response, next) => {
      
    const {companyId}=request.params
    const company=await companyModel.findById(companyId)

    if(!company || company.deletedAt){
        return next(new Error("Company not found",{cause:404}))
    }
    
    if(company.createdBy.toString() != request.user._id.toString()){
        return next(new Error("This action cannot be happened, you are not the owner",{cause:400}))
    }
   
    if(!company.coverPic.public_id){
      return next(new Error("Cover pic don't exist",{cause:400}))
    }
      //delete the existing image from public_id
      await cloudinary.uploader.destroy(company.coverPic.public_id);
  
   await companyModel.updateOne(
        { _id: companyId},
        { $unset: { coverPic: 0 } }
      );
  
      return response.status(200).json({ message: "Compnay cover pic deleted" });
    }
  );
  
  
