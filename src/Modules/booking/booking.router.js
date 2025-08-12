import { Router } from 'express'
import authorization from "../../Middleware/authorization.middleware.js";
import * as bookingController from "./controller/booking.controller.js";

const router = new Router();

// Create a new booking (rent soccer)
router.post("/createBooking",authorization(["user", "admin"]),  bookingController.createBooking
);

// Update an existing booking
router.put(
  "/:id",
  authorization(["admin"]),
  bookingController.updateBooking
);

// Delete a booking
router.delete(
  "/:id",
  authorization(["admin"]),
  bookingController.deleteBooking
);

export default router;