import mongoose from "mongoose";
import {
  gender,
  otpTypes,
  provider,
  role,
} from "../../utils/enum/user.enum.js";
import { Decrypt, Encrypt, Hash } from "../../utils/index.js";
import applicationModel from "./application.model.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    email: {
      type: String,
      requiredL: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(provider),
      default: provider.system,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
      default: "Male",
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const currentDate = new Date();
          return value < currentDate;
        },
        message: "Date of Birth must be smaller than current date.",
      },
    },
    mobileNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(role),
      default: "User",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: Boolean,
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: Date,
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: String, //hashed
        type: {
          type: String,
          enum: Object.values(otpTypes),
        },
        expiresIn: Date,
      },
    ],
  },
  { timestamps: true }
);
// for the virtual field
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
  virtuals: true,
});
//pre save hook to calculate the age before saving
userSchema.pre("save", async function (next) {
  const currentDate = new Date();
  const dob = this.DOB;
  let age = currentDate.getFullYear() - dob.getFullYear();
  const monthDifference = currentDate.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }
  if (age < 18) {
    return next(new Error("Age must be greater than 18 years."));
  }
  //hashing password
  if (this.isModified("password")) {
    this.password = await Hash(this.password);
  }
  //encrypting mobileNumber 
  if(this.isModified("mobileNumber")){
  this.mobileNumber = await Encrypt(this.mobileNumber);
  }
  next();
});

userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const userId = this._id;
  await applicationModel.deleteMany({ userId });
  next();
});

userSchema.post("findOne", async function (doc,next) {
if(doc){
  doc.mobileNumber = await Decrypt(doc.mobileNumber); 
}  
next();
});
const userModel = mongoose.model("User", userSchema);
export default userModel;
