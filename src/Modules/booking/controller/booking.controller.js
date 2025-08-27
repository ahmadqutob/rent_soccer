import { asyncHandler } from "../../../Services/ErrorHandler.services.js";
import Booking from "../../../../database/Models/booking.models.js";
import { sendEmail } from "../../../Services/SendEmail.services.js";
import { sendWhatsApp } from "../../../Services/sendWhatsapp.services.js";
// change time 19:18 to number 19*60 + 18
const toMinutes = (timeStr) => {
  const [h, m] = String(timeStr).split(":").map(Number);
  if (m < 0 || m > 59) throw new Error("Minutes must be between 0 and 59");
  return h * 60 + m;
};

//string Date user 
// Normalize "YYYY-MM-DD" or "YYYY/MM/DD" -> Date at local 00:00:00.000
const getDayBounds = (dateStr) => {
  const normalized = dateStr.replaceAll("/", "-"); // allow both separators
  const dayStart = new Date(normalized); // convert string to Date object
  if (Number.isNaN(dayStart.getTime())) throw new Error("Invalid dateOfRent");

  dayStart.setHours(0, 0, 0, 0); // start of day
  const dayEnd = new Date(dayStart); 
  dayEnd.setHours(23, 59, 59, 999); // end of day
  return { dayStart, dayEnd };
};

const validateNotPastDate = (dayStart) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (dayStart < todayStart) {
    const e = new Error("Date of rent must be today or in the future");
    e.statusCode = 400;
    throw e;
  }
};

const validateTimeOrder = (startRentTime, endRentTime) => {
  const s = toMinutes(startRentTime);
  const e = toMinutes(endRentTime);
  if (e <= s) {
    const err = new Error("End time must be after start time");
    err.statusCode = 400;
    throw err;
  }
};

const validateNotPastTimeToday = (dayStart, startRentTime) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday = dayStart.getTime() === todayStart.getTime();
  if (isToday) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = toMinutes(startRentTime);
    if (startMinutes < currentMinutes) {
      const e = new Error("Start time must be in the future (cannot book past time today)");
      e.statusCode = 400;
      throw e;
    }
  }
};

const calculateDurationHours = (startRentTime, endRentTime) => {
  const startRentTime_min = toMinutes(startRentTime);
  const endRentTime_min = toMinutes(endRentTime);
  return (endRentTime_min - startRentTime_min) / 60; // convert minutes -> hours
};

const calculatePrice = (durationHours, pricePerHour = 70) => {
  return Math.round(Number(durationHours) * pricePerHour * 100) / 100; // round to 2 decimals
};

export const createBooking = asyncHandler(async (req, res, next) => {
  const userID = req.user._id;
  const {
    renterName,
    renterPhone,
    renterEmail,
    dateOfRent,
    startRentTime,
    endRentTime,
    anyComment,
  } = req.body;

  // 1) Day bounds
  const { dayStart, dayEnd } = getDayBounds(dateOfRent);

  // 2) Date not in past
  validateNotPastDate(dayStart);

  // 3) EndRentTime > StartRentTime
  validateTimeOrder(startRentTime, endRentTime);

  // 4) If booking today, start must be >= now
  validateNotPastTimeToday(dayStart, startRentTime);

  // 5) Check overlaps (same field or global if single field)
  const match = {
    dateOfRent: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: "cancelled" },
  };
  const sameDay = await Booking.find(match).lean();

  const newStart = toMinutes(startRentTime);
  const newEnd = toMinutes(endRentTime);

  const conflict = sameDay.find((b) => {
    const bStart = toMinutes(b.startRentTime);
    const bEnd = toMinutes(b.endRentTime);
    return !(newEnd <= bStart || newStart >= bEnd); // overlap
  });

  if (conflict) {
    return res.status(409).json({
      message: "Time slot not available",
      conflict: {
        dateOfRent: conflict.dateOfRent,
        startRentTime: conflict.startRentTime,
        endRentTime: conflict.endRentTime,
      },
    });
  }

  // 6) Calculate duration & price
  const durationHours = calculateDurationHours(startRentTime, endRentTime);
  const pricePerHour = 70;
  const totalPrice = calculatePrice(durationHours, pricePerHour);

  // 7) Create booking
  const created = await Booking.create({
    userId: userID,
    renterName,
    renterPhone,
    renterEmail,
    dateOfRent: dayStart, // store normalized date
    startRentTime,
    endRentTime,
    durationHours,
    pricePerHour,
    totalPrice,
    anyComment,
    status: "pending",
    createdBy: userID,
  });

  // 8) Send confirmation email
  await sendEmail(
    created.renterEmail,
    "📅 Your Booking Request Received",
    `
      <h2>Hello ${created.renterName} 👋</h2>
      <p>Thank you for your booking request.</p>
      <p><b>Date of Rent:</b> ${created.dateOfRent.toDateString()}</p>
      <p><b>From:</b> ${created.startRentTime}</p>
      <p><b>To:</b> ${created.endRentTime}</p>
      <p><b>Phone:</b> ${created.renterPhone}</p>
      <p><b>Comments:</b> ${created.anyComment || "None"}</p>
      <p><b>Total Price:</b> ${created.totalPrice} ₪</p>
      <hr/>
      <p>We will contact you soon to confirm ✅</p>
    `
  );



  await sendWhatsApp(
    renterPhone,
    `Hello ${renterName}, your booking on ${dayStart.toDateString()} from ${startRentTime} to ${endRentTime} has been received. Total price: ${totalPrice} ₪`
  );

  return res.status(201).json({
    success: true,
    message: "Booking created",
    data: created,
  });
});
