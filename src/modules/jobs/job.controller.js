import { Router } from "express";
import * as JS from "./job.service.js";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import * as JV from "./job.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileTypes } from "../../utils/enum/multer.enum.js";
import { multerHost } from "../../middleware/multer.middleware.js";

const jobRouter = Router();

jobRouter.post(
  "/createJob",
  validation(JV.createjobSchema),
  authentication,
  JS.createJob
);
jobRouter.patch(
  "/update/:jobId",
  validation(JV.updatejobSchema),
  authentication,
  JS.updateJob
);
jobRouter.delete(
  "/delete/:jobId",
  validation(JV.deletejobSchema),
  authentication,
  JS.deletejob
);

jobRouter.get(
  "/getjobs-company/:companyId?",
  validation(JV.getorsearchSchema),
  JS.getORSearch
);
jobRouter.get(
  "/getwithfilter",
  validation(JV.getwithfilterSchema),
  JS.getwithfilter
);

jobRouter.get(
  "/getApplications/:jobId",
  validation(JV.getapplicationsSchema),
  authentication,
  JS.getapplications
);

jobRouter.post(
    "/apply/:jobId",
    multerHost(fileTypes.pdf).single("usercv"),
    validation(JV.applyjobSchema),
    authentication,
    authorization(["User"]),
    JS.jobApplication
  );

  
jobRouter.patch(
    "/hremail",
    validation(JV.hremailSchema),
    authentication,
    JS.hremail
  );


export default jobRouter;
