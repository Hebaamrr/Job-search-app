import mongoose from "mongoose";

export const connectionDB=async()=>{
   await mongoose.connect(process.env.URI)
    .then(()=>{
    console.log('Connected to MongoDB');
    
   }).catch((error)=>{
    console.log('Error connectiong Database',error);
   })
}
