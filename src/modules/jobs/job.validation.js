import joi from "joi";
import { jobLocation, level, workingTime } from "../../utils/enum/job.enum.js";
import { generalRules } from "../../utils/index.js";

export const createjobSchema = {
  body: joi.object({
    jobTitle: joi.string().required(),
    jobLocation: joi
      .string()
      .valid(jobLocation.hybrid, jobLocation.onsite, jobLocation.remotely)
      .required(),
    workingTime: joi
      .string()
      .valid(workingTime["full-time"], workingTime["part-time"])
      .required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string().required(),
    companyId: generalRules.objectId.required(),
  }),
  headers: generalRules.headers.required(),
};

export const updatejobSchema = {
  body: joi.object({
    jobTitle: joi.string(),
    jobLocation: joi
      .string()
      .valid(jobLocation.hybrid, jobLocation.onsite, jobLocation.remotely),
    workingTime: joi
      .string()
      .valid(workingTime["full-time"], workingTime["part-time"]),
    seniorityLevel: joi.string(),
    jobDescription: joi.string(),
  }),
  params: joi.object({
    jobId: generalRules.objectId.required(),
  }),
  headers: generalRules.headers.required(),
};

export const deletejobSchema = {
  params: joi.object({
    jobId: generalRules.objectId.required(),
  }),
  headers: generalRules.headers.required(),
};

export const getorsearchSchema = {
  params: joi.object({
    companyId: generalRules.objectId,
  }),
  query: joi.object({
    search: joi.string(),
    skip: joi.number(),
    limit: joi.number(),
  }),
};

export const getwithfilterSchema = {
  query: joi.object({
    skip: joi.number(),
    limit: joi.number(),
    workingTime: joi.string(),
    jobLocation: joi.string(),
    seniorityLevel: joi.string(),
    jobTitle: joi.string(),
    technicalSkills: joi.string(),
  }),
};

export const getapplicationsSchema = {
  query: joi.object({
    skip: joi.number(),
    limit: joi.number(),
  }),
  params:joi.object({
     jobId:generalRules.objectId.required()
  }),
  headers:generalRules.headers.required()
};

export const applyjobSchema={
  params:joi.object({
    jobId:generalRules.objectId.required()
 }),
 headers:generalRules.headers.required()
}

export const hremailSchema={
  body:joi.object({
    applicationId:generalRules.objectId.required(),
    status:joi.string().required()
  }),
  headers:generalRules.headers.required()
}
