import jwt from "jsonwebtoken";
export const verifyToken=async({token,SECRET_KEY})=>{
    return jwt.verify(token, SECRET_KEY);
}