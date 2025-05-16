import CryptoJS from "crypto-js";


export const Encrypt=(key,SIGNATURE=process.env.SIGNATURE)=>{
    return CryptoJS.AES.encrypt(key,SIGNATURE).toString();
}