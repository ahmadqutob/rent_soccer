import joi from "joi";

export const createBooking = joi.object({
  body: joi
    .object({
      renterName: joi.string().min(10).max(25).required().messages({
        "string.min": "Renter name must be at least 10 characters long",
        "string.max": "Renter name cannot exceed 25 characters",
        "any.required": "Renter name is required",
      }),
      renterPhone: joi
        .string()
        .pattern(/^[+]?[\d\s\-\(\)]{8,15}$/)
        .required()
        .messages({
          "string.pattern.base": "Please provide a valid phone number",
          "any.required": "Renter phone is required",
        }),
      renterEmail: joi.string().email().optional().messages({
        "string.email": "Please provide a valid email address",
      }),
      dateOfRent: joi //2025/11/30
        .string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
        .required()
        .messages({
          "string.pattern.base":
            "Date must be in YYYY-MM-DD format (e.g., 2025-08-15)",
          "any.required": "Date of rent is required",
        }),
      startRentTime: joi // '09:00'
        .string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.pattern.base":
            "Start time must be in HH:MM format (e.g., 17:00)",
          "any.required": "Start time is required",
        }),
      endRentTime: joi // '10:00'
        .string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          "string.pattern.base":
            "End time must be in HH:MM format (e.g., 19:00)",
          "any.required": "End time is required",
        }),
      // durationHours: joi
      //   .number()
      //   .positive()
      //   .min(0.5)
      //   .max(24)
      //   .required()
      //   .messages({
      //     "number.positive": "Duration must be a positive number",
      //     "number.min": "Duration must be at least 0.5 hours",
      //     "number.max": "Duration cannot exceed 24 hours",
      //     "any.required": "Duration is required",
      //   }),
      anyComment: joi.string().max(500).optional().messages({
        "string.max": "Comment cannot exceed 500 characters",
      }),
    })
    .custom((value, helpers) => {
      // Custom validation to ensure end time is after start time
      const startRentTime = new Date(`2000-01-01T${value.startRentTime}:00`); //2000-01-01T17:00:00
      const endRentTime = new Date(`2000-01-01T${value.endRentTime}:00`);    //2000-01-01T18:30:00

      if (endRentTime <= startRentTime) {
        return helpers.error("any.invalid", {
          message: "End time must be after start time",
        });
      }

      

      return value;
    }),
});
 