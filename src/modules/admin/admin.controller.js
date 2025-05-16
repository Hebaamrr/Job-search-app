import {Router} from "express"
import * as AS from "./admin.service.js"
import { authentication } from "../../middleware/auth.middleware.js"
import { validation } from "../../middleware/validation.middleware.js"
import * as AV from "./admin.validation.js"

const adminRouter=Router()
adminRouter.patch('/banUser/:userId',validation(AV.userbanValidation),authentication,AS.banUser)
adminRouter.patch('/banCompany/:companyId',validation(AV.companyValidation),authentication,AS.banCompany)
adminRouter.patch('/approvecompany/:companyId',validation(AV.companyValidation),authentication,AS.approveCompany)

export default adminRouter