import userModel from "../../../DB/models/user.model.js"
import companyModel from "../../../DB/models/company.model.js"


export const getUsers=async(parent,args)=>{
    const users=await userModel.find()
    return users
}

export const getCompany=async(parent,args)=>{
    const companies=await companyModel.find()
    return companies
}