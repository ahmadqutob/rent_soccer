import joi from "joi";

export const createBooking = joi.object({
    body: joi.object({
        renterName: joi.string().min(10).max(25).required().messages({
            'string.min': 'Renter name must be at least 10 characters long',
            'string.max': 'Renter name cannot exceed 25 characters',
            'any.required': 'Renter name is required'
        }),
        renterPhone: joi.string().pattern(/^[+]?[\d\s\-\(\)]{8,15}$/).required().messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Renter phone is required'
        }),
        renterEmail: joi.string().email().optional().messages({
            'string.email': 'Please provide a valid email address'
        }),
        dateOfRent: joi.date().min('now').required().messages({ //"2025-08-15T18:00:00Z"
            'date.min': 'Date of rent must be in the future',
            'any.required': 'Date of rent is required'
        }),
        startTime: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
            'string.pattern.base': 'Start time must be in HH:MM format (e.g., 17:00)',
            'any.required': 'Start time is required'
        }),
        endTime: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
            'string.pattern.base': 'End time must be in HH:MM format (e.g., 19:00)',
            'any.required': 'End time is required'
        }),
        durationHours: joi.number().positive().min(0.5).max(24).required().messages({
            'number.positive': 'Duration must be a positive number',
            'number.min': 'Duration must be at least 0.5 hours',
            'number.max': 'Duration cannot exceed 24 hours',
            'any.required': 'Duration is required'
        }),
        anyComment: joi.string().max(500).optional().messages({
            'string.max': 'Comment cannot exceed 500 characters'
        })
    }).custom((value, helpers) => {
        // Custom validation to ensure end time is after start time
        const startTime = new Date(`2000-01-01T${value.startTime}:00`);
        const endTime = new Date(`2000-01-01T${value.endTime}:00`);
        
        if (endTime <= startTime) {
            return helpers.error('any.invalid', { message: 'End time must be after start time' });
        }
        
        // Validate that duration matches the time difference
        const timeDiffHours = (endTime - startTime) / (1000 * 60 * 60);
        if (Math.abs(timeDiffHours - value.durationHours) > 0.1) {
            return helpers.error('any.invalid', { message: 'Duration hours must match the difference between start and end time' });
        }
        
        return value;
    })
});

export const updateBooking = joi.object({
    params: joi.object({
        id: joi.string().hex().length(24).required().messages({
            'string.hex': 'Invalid booking ID format',
            'string.length': 'Booking ID must be 24 characters long',
            'any.required': 'Booking ID is required'
        })
    }),
    body: joi.object({
        renterName: joi.string().min(2).max(50).optional().messages({
            'string.min': 'Renter name must be at least 2 characters long',
            'string.max': 'Renter name cannot exceed 50 characters'
        }),
        renterPhone: joi.string().pattern(/^[+]?[\d\s\-\(\)]{8,15}$/).optional().messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),
        renterEmail: joi.string().email().optional().messages({
            'string.email': 'Please provide a valid email address'
        }),
        dateOfRent: joi.date().min('now').optional().messages({
            'date.min': 'Date of rent must be in the future'
        }),
        startTime: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
            'string.pattern.base': 'Start time must be in HH:MM format (e.g., 17:00)'
        }),
        endTime: joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
            'string.pattern.base': 'End time must be in HH:MM format (e.g., 19:00)'
        }),
        durationHours: joi.number().positive().min(0.5).max(24).optional().messages({
            'number.positive': 'Duration must be a positive number',
            'number.min': 'Duration must be at least 0.5 hours',
            'number.max': 'Duration cannot exceed 24 hours'
        }),
        pricePerHour: joi.number().positive().min(10).max(1000).optional().messages({
            'number.positive': 'Price per hour must be a positive number',
            'number.min': 'Price per hour must be at least 10',
            'number.max': 'Price per hour cannot exceed 1000'
        }),
        totalPrice: joi.number().positive().min(0).optional().messages({
            'number.positive': 'Total price must be a positive number',
            'number.min': 'Total price cannot be negative'
        }),
        status: joi.string().valid('confirmed', 'pending', 'cancelled').optional().messages({
            'any.only': 'Status must be one of: confirmed, pending, cancelled'
        }),
        anyComment: joi.string().max(500).optional().messages({
            'string.max': 'Comment cannot exceed 500 characters'
        })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    }).custom((value, helpers) => {
        // Custom validation for time consistency if both start and end time are provided
        if (value.startTime && value.endTime) {
            const startTime = new Date(`2000-01-01T${value.startTime}:00`);
            const endTime = new Date(`2000-01-01T${value.endTime}:00`);
            
            if (endTime <= startTime) {
                return helpers.error('any.invalid', { message: 'End time must be after start time' });
            }
            
            // Validate duration if provided
            if (value.durationHours) {
                const timeDiffHours = (endTime - startTime) / (1000 * 60 * 60);
                if (Math.abs(timeDiffHours - value.durationHours) > 0.1) {
                    return helpers.error('any.invalid', { message: 'Duration hours must match the difference between start and end time' });
                }
            }
        }
        
        return value;
    })
});

export const deleteBooking = joi.object({
    params: joi.object({
        id: joi.string().hex().length(24).required().messages({
            'string.hex': 'Invalid booking ID format',
            'string.length': 'Booking ID must be 24 characters long',
            'any.required': 'Booking ID is required'
        })
    })
});

// Additional validation for getting booking by ID
export const getBookingById = joi.object({
    params: joi.object({
        id: joi.string().hex().length(24).required().messages({
            'string.hex': 'Invalid booking ID format',
            'string.length': 'Booking ID must be 24 characters long',
            'any.required': 'Booking ID is required'
        })
    })
});

// Validation for getting all bookings with optional filters
export const getAllBookings = joi.object({
    query: joi.object({
        status: joi.string().valid('confirmed', 'pending', 'cancelled').optional().messages({
            'any.only': 'Status must be one of: confirmed, pending, cancelled'
        }),
        dateFrom: joi.date().optional().messages({
            'date.base': 'Date from must be a valid date'
        }),
        dateTo: joi.date().optional().messages({
            'date.base': 'Date to must be a valid date'
        }),
        page: joi.number().integer().min(1).optional().default(1).messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
        limit: joi.number().integer().min(1).max(100).optional().default(10).messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit cannot exceed 100'
        })
    }).custom((value, helpers) => {
        // Custom validation to ensure dateTo is after dateFrom if both are provided
        if (value.dateFrom && value.dateTo && value.dateTo <= value.dateFrom) {
            return helpers.error('any.invalid', { message: 'Date to must be after date from' });
        }
        return value;
    })
});