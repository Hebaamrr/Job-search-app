import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const signupSchema={
    body:joi.object({
        firstName:joi.string().min(3).required(),
        lastName:joi.string().min(3).required(),
        email:generalRules.email.required(),
        password:generalRules.password.required(),
        cPassword:generalRules.password.valid(joi.ref("password")).required(),
        DOB:joi.date().iso().max('now').required() ,
        mobileNumber:generalRules.phone.required()
    })
}

export const confirmEmailSchema = {
    body: joi.object({
      email: generalRules.email.required(),
      code: joi.string().length(4).required(),
    }),
  };
  
export const loginSchema = {
    body: joi.object({
      email: generalRules.email.required(),
      password: generalRules.password.required(),
    }),
};

export const resetpasswordSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    code: joi.string().length(4).required(),
    newpassword: generalRules.password.required(),
    cPassword: generalRules.password.valid(joi.ref("newpassword")).required(),
  }),
};

export const refreshTokenSchema = {
  body: joi.object({
    authorization: joi.string().required(),
  }),
};

export const updateAccountSchema={
    body:joi.object({
        mobileNumber:generalRules.phone,
         DOB:joi.date().iso().max('now'),
         firstName:joi.string().min(3), 
         lastName:joi.string().min(3),
         gender:generalRules.gender
    })
}

export const headersonly={
    headers:generalRules.headers.required()
}

export const getuserProfileSchema={
  params:joi.object({
    id: generalRules.objectId.required()
  }),
  headers:generalRules.headers.required()
}

export const updatePasswordSchema={
    body:joi.object({
        oldPassword:generalRules.password.required(),
        newPassword:generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required(),
    }),
    headers:generalRules.headers.required()
}

export const uploadProfilePicSchema={
  file: generalRules.file.required(),
  headers:generalRules.headers.required()
}