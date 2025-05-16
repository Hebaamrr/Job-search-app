
import userModel from "../DB/models/user.model.js";
import { tokentypes } from "../utils/enum/user.enum.js";
import { asyncHandler } from "../utils/error/index.js";
import { verifyToken } from "../utils/index.js";



export const decodedToken=async({auth,tokentype, next})=>{
  const [prefix, token] = auth.split(" ") || [];

  if (!prefix || !token) {
    return next(new Error("Token is required.",{cause:401}))
  }
  let ACCESS_SIGN_TOKEN = undefined;
  let REFRESH_SIGN_TOKEN=undefined

  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGN_TOKEN = process.env.ACCESS_SECRET_KEY_ADMIN;
    REFRESH_SIGN_TOKEN = process.env.REFRESH_SECRET_KEY_ADMIN;

  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGN_TOKEN = process.env.ACCESS_SECRET_KEY_USER;
    REFRESH_SIGN_TOKEN = process.env.REFRESH_SECRET_KEY_USER;
  } else {
    return next(new Error("Invalid Token prefix",{cause:401}))
  }

  const decoded =await verifyToken({
    token,
    SECRET_KEY: tokentype===tokentypes.access? ACCESS_SIGN_TOKEN : REFRESH_SIGN_TOKEN
  }) 

  if (!decoded?.id) {
    return next(new Error("Invalid Token Payload." ,{cause:403}))
  }
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found.",{cause:404}))
  }
  if(user?.isDeleted){
    return next(new Error("User deleted",{cause:401}))
  }

  //check the time when the password changed and when the token initiated
  if(parseInt(user?.changeCredentialTime?.getTime()/1000) > decoded.iat){
     return next(new Error("Token expired, please login again.",{cause:401}))
  }
   return user
}
export const authentication =asyncHandler( async (request, response, next) => {
  const { auth } = request.headers;

 const user=await decodedToken({auth , tokentype:tokentypes.access, next})
  
  request.user = user;
  next();

})

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (request, response, next) => {
      //authorization
      if (!accessRoles.includes(request.user.role)) {
        return next(new Error( "Access denied.",{cause:403}))
      }
      next();
  })
}
