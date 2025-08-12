import { asyncHandler } from "../../../Services/ErrorHandler.services.js";

export const createBooking = asyncHandler(async (req, res, next) => {
  const userId = req.id;

  const { renterName, renterPhone, renterEmail, dateOfRent, startTime,
    endTime ,durationHours , anyComment  } = req.body;

  // TODO: Persist booking to database
  return res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: { userId, fieldId, date, startTime, endTime, notes },
  });
});

export const updateBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  // TODO: Update booking in database
  return res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: { id, updates },
  });
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // TODO: Delete booking from database
  return res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
    data: { id },
  });
});


