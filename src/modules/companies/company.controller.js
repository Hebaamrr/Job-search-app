import {Router} from "express"
import * as CS from "./company.service.js"
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";
import * as CV from "./company.validation.js";
import { multerHost } from "../../middleware/multer.middleware.js";
import { fileTypes } from "../../utils/enum/multer.enum.js";


const companyRouter=Router()

companyRouter.post('/create',validation(CV.createValidation),authentication,CS.createCompany)
companyRouter.patch('/update/:companyId',validation(CV.updateValidation),authentication,CS.updateCompany)
companyRouter.delete('/delete/:companyId',validation(CV.softDeleteCompanySchema),authentication,CS.softDeleteCompany)
companyRouter.get('/getjobs/:companyId',validation(CV.getwithjobsSchema),CS.getcompanywithjobs)
companyRouter.get('/search',validation(CV.searchSchema),CS.searchbyname)

companyRouter.post(
  "/upload/logo/:companyId",
  multerHost(fileTypes.image).single("logo"),
  validation(CV.uploadLogoSchema),
  authentication,
  CS.uploadLogo
);

companyRouter.post(
  "/upload/cover/:companyId",
  multerHost(fileTypes.image).single("cover"),
  validation(CV.uploadLogoSchema),
  authentication,
  CS.uploadCoverpic
);


companyRouter.delete(
  "/delete/logo/:companyId",
  validation(CV.deletePic),
  authentication,
  CS.deleteLogo);

  companyRouter.delete(
    "/delete/cover/:companyId",
    validation(CV.deletePic),
    authentication,
    CS.deletecover);
  



export default companyRouter