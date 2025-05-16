import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const createValidation={
    body:joi.object({
        companyName:joi.string().required(),
        address:joi.string().required(),
        companyEmail:generalRules.email.required(),
        HRs:joi.array().items(generalRules.objectId).required(),
        numberOfEmployees:joi.object({
            min:joi.number().positive().required(),
            max:joi.number().positive().required()
        })
    }),
    headers:generalRules.headers.required()
}

export const updateValidation={
    body:joi.object({
        companyName:joi.string(),
        address:joi.string(),
        companyEmail:generalRules.email,
        HRs:joi.array().items(generalRules.objectId),
        numberOfEmployees:joi.object({
            min:joi.number().positive(),
            max:joi.number().positive()
        })
    
    }),
    headers:generalRules.headers.required()

}

export const softDeleteCompanySchema={
    params: joi.object({
        companyId:generalRules.objectId.required()
    }),
    headers:generalRules.headers.required()
}

export const getwithjobsSchema={
    params: joi.object({
        companyId:generalRules.objectId.required()
    }),
}

export const searchSchema={
    body:joi.object({
        companyName: joi.string().required()
    })
}

export const uploadLogoSchema={
    params:joi.object({
    companyId:generalRules.objectId.required(),
    }),
    file:generalRules.file.required(),
  headers:generalRules.headers.required()

}

export const deletePic={
    params:joi.object({
        companyId:generalRules.objectId.required(),
        }),
      headers:generalRules.headers.required()
}

