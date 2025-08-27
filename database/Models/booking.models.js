import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

 
const bookingSchema = new mongoose.Schema({
     
    userId: { type: Types.ObjectId, ref: "User", required: true },
     
    renterName: { type: String, required: true, trim: true },
    renterPhone: { type: String, required: true, trim: true },
    renterEmail: { type: String, trim: true, lowercase: true },

//   date info
  dateOfRent: { type: Date, required: true }, 
  startRentTime: { type: String, required: true }, // e.g., "17:00"
  endRentTime: { type: String, required: true },   // e.g., "19:00"
  durationHours: { type: Number, required: true, min:0.5 },//1h or 1.5h...etc
  //   payments
  pricePerHour: { type: Number, default: 70},
  totalPrice:    { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "pending" },
  // user comment
  anyComment: { type: String, trim: true },


}, { timestamps: true });


bookingSchema.index(
  {   dateOfRent: 1, startRentTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);

export default mongoose.model("Booking", bookingSchema);

