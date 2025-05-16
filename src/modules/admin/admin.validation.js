import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const userbanValidation={
    params:joi.object({
        userId:generalRules.objectId.required()
    }),
    headers:generalRules.headers.required()
}

export const companyValidation={
    params:joi.object({
        companyId:generalRules.objectId.required()
    }),
    headers:generalRules.headers.required()
}
