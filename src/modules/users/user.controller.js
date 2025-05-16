import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";
import { multerHost } from "../../middleware/multer.middleware.js";
import { fileTypes } from "../../utils/enum/multer.enum.js";

const userRouter = Router();
userRouter.post("/signup", validation(UV.signupSchema), US.signup);
userRouter.patch(
  "/confirmEmail",
  validation(UV.confirmEmailSchema),
  US.confirmEmail
);
userRouter.post("/login", validation(UV.loginSchema), US.login);

userRouter.get(
  "/forgetPassword",
  validation(UV.headersonly),
  authentication,
  US.forgetPassword
);
userRouter.patch(
  "/resetPassword",
  validation(UV.resetpasswordSchema),
  US.resetPassword
);
userRouter.get(
  "/refreshtoken",
  validation(UV.refreshTokenSchema),
  US.refreshToken
);

userRouter.patch(
  "/updateaccount",
  validation(UV.updateAccountSchema),
  authentication,
  US.updateAccount
);
userRouter.get(
  "/getProfile",
  validation(UV.headersonly),
  authentication,
  US.getLoggedInProfile
);
userRouter.get(
  "/userProfile/:id",
  validation(UV.getuserProfileSchema),
  authentication,
  US.getUsersProfile
);

userRouter.patch(
  "/update/password",
  validation(UV.updatePasswordSchema),
  authentication,
  US.updatePassword
);

userRouter.post(
  "/upload/profilepic",
  multerHost(fileTypes.image).single("profilePic"),
  validation(UV.uploadProfilePicSchema),
  authentication,
  US.profilepic
);

userRouter.post(
  "/upload/coverpic",
  multerHost(fileTypes.image).single("coverpic"),
  validation(UV.uploadProfilePicSchema),
  authentication,
  US.coverpic
);

userRouter.delete(
  "/delete/profilepic",
  validation(UV.headersonly),
  authentication,
  US.deleteProfilepic
);

userRouter.delete(
  "/delete/coverpic",
  validation(UV.headersonly),
  authentication,
  US.deletecoverpic
);

userRouter.delete(
  "/delete/softdelete",
  validation(UV.headersonly),
  authentication,
  US.softDelete
);
export default userRouter;
