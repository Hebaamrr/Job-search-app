import bcrypt from "bcrypt";

export const Compare=async(key,confirmedKey)=>{
    return bcrypt.compareSync(key, confirmedKey);
}