import userModel from "../../DB/models/user.model.js";
import companyModel from "../../DB/models/company.model.js";
import { role } from "../../utils/enum/user.enum.js";
import { asyncHandler } from "../../utils/error/index.js";


//2. Ban or Unban user
export const banUser = asyncHandler(async (request, response, next) => {
  const { userId } = request.params;
  const admin = await userModel.findById(request.user._id);
  if (admin.role !== role.Admin) {
    // an admin shoud make this action
    return next(new Error("This action cannot be done.", { cause: 400 }));
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  //check if this user is banned
  if (user.bannedAt) {
    await userModel.updateOne({ _id: userId }, { $unset: { bannedAt: 0 } });
    return response.status(200).json({ message: "User unbanned" });
  } else {
    await userModel.updateOne({ _id: userId }, { bannedAt: Date.now() });
    return response.status(200).json({ message: "User banned" });
  }
});


//3. ban or unban company
export const banCompany = asyncHandler(async (request, response, next) => {
  const { companyId } = request.params;
  const admin = await userModel.findById(request.user._id);
  if (admin.role !== role.Admin) {
    return next(new Error("This action cannot be done.", { cause: 400 }));
  }

  const company = await companyModel.findById(companyId);
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (company.bannedAt) {
    await companyModel.updateOne(
      { _id: companyId },
      { $unset: { bannedAt: 0 } }
    );
    return response.status(200).json({ message: "Company unbanned" });
  } else {
    await companyModel.updateOne({ _id: companyId }, { bannedAt: Date.now() });
    return response.status(200).json({ message: "Company banned" });
  }
});

//4. approve company
export const approveCompany = asyncHandler(async (request, response, next) => {
  const { companyId } = request.params;
  const admin = await userModel.findById(request.user._id);
  if (admin.role !== role.Admin) {
    return next(new Error("This action cannot be done.", { cause: 400 }));
  }
  const company = await companyModel.findById(companyId);
  if (!company || company.deletedAt) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  await companyModel.updateOne({_id:companyId},{approvedByAdmin:true})
  return response.status(200).json({message:"done"})
});
