import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
<<<<<<< HEAD
=======
  bio?: string;
  image?: string;
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["student", "instructor"], 
    required: true 
  },
<<<<<<< HEAD
=======
  bio: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  resetPasswordToken: { 
    type: String,
    default: undefined
  },
  resetPasswordExpires: { 
    type: Date,
    default: undefined
  }
}, {
  timestamps: true 
});


UserSchema.index({ email: 1 });

UserSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });

export default mongoose.model<IUser>("User", UserSchema);