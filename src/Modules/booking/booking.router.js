import { Router } from 'express'
import authorization from "../../Middleware/authorization.middleware.js";
import * as bookingController from "./controller/booking.controller.js";
import validation from '../../Middleware/validation.middleware.js';
import * as validationSchema from './booking.validation.js'
const router = new Router();

// Create a new booking (rent soccer)
router.post("/createBooking",authorization(["user", "admin"]),validation(validationSchema.createBooking) , bookingController.createBooking
);

 
 

export default router;