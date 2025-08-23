import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<INotification>("Notification", NotificationSchema);
