import mongoose from "mongoose";
import { status } from "../../utils/enum/application.enum.js";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {// the applier id
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userCV:{ //pdf only
    secure_url:String,
    public_id:String
  },
status:{
    type:String,
    enum: Object.values(status),
    default:status.pending
}
},
{timestamps:true});

applicationSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

const applicationModel=mongoose.model('Application',applicationSchema)
export default applicationModel