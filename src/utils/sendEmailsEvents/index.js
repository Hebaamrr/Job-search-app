import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmails.js";
import { customAlphabet } from "nanoid";
import userModel from "../../DB/models/user.model.js";
import { html } from "../../service/template-email.js";
import { Hash } from "../hash/hash.js";
import { otpTypes } from "../enum/user.enum.js";
import applicationModel from "../../DB/models/application.model.js";
export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmailConfirmation", async (data) => {
  const { email } = data;
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
  
  await userModel.updateOne({email},{OTP:[
    {code:hashedOtp,
     type:otpTypes.confirmEmail,
     expiresIn:new Date(Date.now()+10*60*1000)
    }
  ]})
 
  const emailSender = await sendEmail(
    email,
    "Confirm Email",
     html(otp,"Email Confirmation")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});

eventEmitter.on("newEmailConfirmation", async (data) => {
  const { email,id } = data;
  //generate otp
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
  await userModel.updateOne({tempEmail:email,_id:id},{otpnewEmail:hashedOtp})
  
  const emailSender = await sendEmail(
    email,
    "Confirm Email",
     html(otp,"New Email Confirmation")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});


eventEmitter.on("forgetPassowrd", async (data) => {
  const { email } = data;
  //generate otp
  const otp = customAlphabet("123456789", 4)();
  const hashedOtp=await Hash(otp)
  await userModel.updateOne({email},{OTP:[
    {code:hashedOtp,
     type:otpTypes.forgetPassword,
     expiresIn:new Date(Date.now()+10*60*1000)
    }
  ]})
  
  const emailSender = await sendEmail(
    email,
    "Reset password",
     html(otp,"Reset Password")
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});

eventEmitter.on("applicationEmail", async (data) => {
  const { userId,status } = data;
  const user=await userModel.findById(userId)
  const email=user.email
  await applicationModel.updateOne({userId},{status})
  
  const emailSender = await sendEmail(
    email,
    "Application Email",
     html(status,`Your application is ${status}`)
  );
  if (!emailSender) {
    return response.status(500).json({ message: "Failed to send Otp " });
  }
});