import cloudinary from "../../utils/cloudinary/index.js";
import userModel from "../../DB/models/user.model.js";
import { otpTypes, role } from "../../utils/enum/user.enum.js";
import {
  asyncHandler,
  Compare,
  Encrypt,
  eventEmitter,
  generateToken,
  Hash,
} from "../../utils/index.js";

///////////////////////////////auth apis/////////////////////////////////

//1.sign up
export const signup = asyncHandler(async (request, response, next) => {
  const { firstName, lastName, email, password, DOB, mobileNumber } =
    request.body;
  //check if the email alreday exists
  const emailExists = await userModel.findOne({ email: request.body.email });
  if (emailExists) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    DOB,
    mobileNumber,
  });

  //send otp to confirm the email
  eventEmitter.emit("sendEmailConfirmation", { email });

  return response
    .status(201)
    .json({ message: "User signed up successfully", user });
});

//2. confirm OTP
export const confirmEmail = asyncHandler(async (request, response, next) => {
  const { email, code } = request.body;
  const user = await userModel.findOne({ email, isConfirmed: false });
  //check email
  if (!user) {
    return next(
      new Error("Email don't exist or already confirmed.", { cause: 404 })
    );
  }
  //map on the OTP array to access the code
  let newCode = "";
  user.OTP.map((otp) => {
    if(otp.expiresIn < Date.now()){
      return next(new Error("OTP expired"))
    }
    if(otp.type!=otpTypes.confirmEmail){
      return next(new Error("OTP not found"))
    }
    newCode = otp.code;
  });

  const match = await Compare(code, newCode);

  if (!match) {
    return next(new Error("Invaid otp.", { cause: 409 }));
  }

  await userModel.updateOne({ email }, { isConfirmed: true });
  return response.status(200).json({ message: "User confirmed" });
});

//3.signin
export const login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;
  const user = await userModel.findOne({ email, isConfirmed: true });
  //check email
  if (!user) {
    return next(
      new Error("Email don't exist or not confirmed yet.", { cause: 404 })
    );
  }

  //compare the password
  const match = await Compare(password, user.password);
  if (!match) {
    return next(new Error("Invaid password.", { cause: 400 }));
  }
  //generate token
  const access_token = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == role.User
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    option: { expiresIn: "1h" },
  });

  const refresh_token = await generateToken({
    payload: { email, id: user._id },
    SECRET_KEY:
      user.role == role.User
        ? process.env.REFRESH_SECRET_KEY_USER
        : process.env.REFRESH_SECRET_KEY_ADMIN,
    option: { expiresIn: "7d" },
  });
  return response.status(200).json({
    message: "User signed in",
    token: {
      access_token,
      refresh_token,
    },
  });
});

//6. forget password
export const forgetPassword = asyncHandler(async (request, response, next) => {
  const user = await userModel.findOne({ email: request.user.email });
  //check email
  if (!user) {
    return next(new Error("Email don't exist", { cause: 404 }));
  }

  eventEmitter.emit("forgetPassowrd", { email });

  return response.status(200).json({ message: "done" });
});

//7. reset password
export const resetPassword = asyncHandler(async (request, response, next) => {
  const { email, code, newpassword } = request.body;
  const user = await userModel.findOne({ email });
  //check email
  if (!user) {
    return next(new Error("Email don't exist", { cause: 404 }));
  }

    //map on the OTP array to access the code
    let newCode = "";
    user.OTP.map((otp) => {
      if(otp.expiresIn < Date.now()){
        return next(new Error("OTP expired"))
      }
      if(otp.type!=otpTypes.forgetPassword){
        return next(new Error("OTP not found"))
      }
      newCode = otp.code;
    });

  const match = await Compare(code, newCode);
  if (!match) {
    return next(new Error("Invalid otp", { cause: 400 }));
  }
  //hash new password
  const hash = await Hash(newpassword);
  await userModel.updateOne(
    { email },
    { password: hash, isConfirmed: true, changeCredentialTime:Date.now()}
  );
  return response.status(200).json({ message: "Password Changed" });
});

//8. refresh token
export const refreshToken = asyncHandler(async (request, response, next) => {
  const { authorization } = request.body;
  const user = await decodedToken({
    auth: authorization,
    tokentype: tokentypes.refresh,
    next,
  });
  //generate token
  const access_token = await generateToken({
    payload: { email: user.email, id: user._id },
    SECRET_KEY:
      user.role == role.User
        ? process.env.ACCESS_SECRET_KEY_USER
        : process.env.ACCESS_SECRET_KEY_ADMIN,
    option: { expiresIn: "1d" },
  });

  return response.status(200).json({
    message: "Done",
    token: {
      access_token,
    },
  });
});


////////////////user apis//////////////////////////////
//1. Update user account
export const updateAccount = asyncHandler(async (request, response, next) => {
  if (request.body.mobileNumber) {
    request.body.mobileNumber = await Encrypt(request.body.mobileNumber);
  }

  await userModel.updateOne({ _id: request.user._id }, request.body);
  return response.status(200).json({ message: "User updated" });
});
//2.Get login user account data
export const getLoggedInProfile = asyncHandler(
  async (request, response, next) => {
    const user = await userModel
      .findOne({ _id: request.user._id })
      .select("-password");
    return response.status(200).json({ message: "User profile", user });
  }
);
//3. Get profile data for another user
export const getUsersProfile = asyncHandler(async (request, response, next) => {
  const { id } = request.params;
  const user = await userModel
    .findById(id)
    .select("fullName firstName lastName mobileNumber profilePic coverPic");
  return response.status(200).json({ message: "User profile", user });
});

// 4.Update password
export const updatePassword = asyncHandler(async (request, response, next) => {
  const { oldPassword, newPassword } = request.body;

  if (!(await Compare(oldPassword, request.user.password))) {
    return next(new Error("Invalid old password", { cause: 400 }));
  }

  const hash = await Hash(newPassword);

  await userModel.updateOne(
    { _id: request.user._id },
    { password: hash, changeCredentialTime: Date.now() }
  );

  return response.status(200).json({ message: "User updated" });
});

//5. Upload Profile Pic
export const profilepic = asyncHandler(async (request, response, next) => {
  if (!request.file) {
    return next(new Error("Please upload an image", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    request.file.path,
    {
      folder: "exam/profilePics",
    }
  );
  await userModel.updateOne(
    { _id: request.user._id },
    { profilePic: { secure_url, public_id } }
  );

  return response.status(200).json({ message: "Profile picture uploaded" });
});

//6. Upload Cover Pic
export const coverpic = asyncHandler(async (request, response, next) => {
  if (!request.file) {
    return next(new Error("Please upload an image", { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    request.file.path,
    {
      folder: "exam/coverpics",
    }
  );
  await userModel.updateOne(
    { _id: request.user._id },
    { coverPic: { secure_url, public_id } }
  );

  return response.status(200).json({ message: "Cover picture uploaded" });
});

//7. Delete Profile Pic
export const deleteProfilepic = asyncHandler(
  async (request, response, next) => {
    //delete the existing image from public_id
    await cloudinary.uploader.destroy(request.user.profilePic.public_id);

    await userModel.updateOne(
      { _id: request.user._id },
      { $unset: { profilePic: 0 } }
    );

    return response.status(200).json({ message: "Profile picture deleted" });
  }
);

//8. Delete Cover Pic
export const deletecoverpic = asyncHandler(async (request, response, next) => {
  //delete the existing image from public_id
  await cloudinary.uploader.destroy(request.user.coverPic.public_id);

  await userModel.updateOne(
    { _id: request.user._id },
    { $unset: { coverPic: 0 } }
  );

  return response.status(200).json({ message: "Cover picture deleted" });
});

//9. soft delete accout
export const softDelete = asyncHandler(async (request, response, next) => {
  await userModel.updateOne(
    { _id: request.user._id },
    { isDeleted: true, changeCredentialTime: Date.now() }
  );
  return response.status(200).json({ message: "Account deleted" });
});
