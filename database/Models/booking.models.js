import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

 
const bookingSchema = new mongoose.Schema({
    // renter info
  renterName: { type: String, required: true },
  renterPhone: { type: String, required: true },
  renterEmail: { type: String },
//   date info
  dateOfRent: { type: Date, required: true }, 
  startTime: { type: String, required: true }, // e.g., "17:00"
  endTime: { type: String, required: true },   // e.g., "19:00"
  durationHours: { type: Number, required: true },//1h or 1.5h...etc
  //   payments
  pricePerHour: { type: Number, default: 70},
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "pending" },
  // user comment
  anyComment: { type: String },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
