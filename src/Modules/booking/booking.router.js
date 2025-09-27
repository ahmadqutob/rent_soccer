import { Router } from 'express'
import authorization from "../../Middleware/authorization.middleware.js";
import * as bookingController from "./controller/booking.controller.js";
import validation from '../../Middleware/validation.middleware.js';
import * as validationSchema from './booking.validation.js'
const router = new Router();

// [create,update,delete,cancel,changeStatus]


// Create a new booking (rent soccer)
router.post("/createBooking",authorization(["user", "admin"]),validation(validationSchema.createBooking) , bookingController.createBooking
);

// Update an existing booking
router.put("/updateBooking/:bookingId", authorization(["user", "admin"]), validation(validationSchema.updateBooking), bookingController.updateBooking);

// Delete a booking
router.delete("/deleteBooking/:bookingId", authorization(["user", "admin"]), validation(validationSchema.deleteBooking), bookingController.deleteBooking);

// Admin-only: cancel a booking
router.patch("/cancelBooking/:bookingId", authorization(["admin"]), validation(validationSchema.adminCancelBooking), bookingController.adminCancelBooking);

// Admin-only: change booking status
router.patch("/changeStatus/:bookingId", authorization(["admin"]), validation(validationSchema.adminChangeStatus), bookingController.adminChangeStatus);

// Admin: list all bookings
router.get("/all", authorization(["admin"]), validation(validationSchema.getAllBookings), bookingController.getAllBookings);

// Admin: export all bookings to PDF
// router.get("/export-pdf", authorization(["admin"]), bookingController.exportBookingsToPDF);


export default router;