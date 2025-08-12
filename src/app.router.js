 import connectDB from '../database/ConnectDB.js'
import authRouter from './Modules/auth/auth.router.js'
import productRouter from './Modules/product/Product.router.js'
import bookingRouter from './Modules/booking/booking.router.js'
// import categoryRouter from './Modules/category/category.router.js'
const initApp = (app,express,next) => {

  connectDB();

  app.use(express.json());

  app.use("/auth", authRouter )
  app.use("/booking", bookingRouter )
  app.use("/products", productRouter )
  // app.use("/category", categoryRouter )





  // catch all routes
// app.all("*", (req, res) => {
//   res.status(404).json({ message: "Page not found" });
// });

  // global error handlers
  // Express will automatically pass errors to this middleware when next(error) is called anywhere.
app.use((err, req, res, next) => {
  console.error(err.stack); // optional: log errors in dev

if (process.env.NODE_ENV === 'development') {
  console.error(err.message);
  return res.status(err.statusCode || 500).json({ message: err.message, stack: err.stack });
}
return res.status(err.statusCode || 500).json({ message: "Something went wrong." });

// stack The file and line number where the error was thrown.
  
});
}
export default initApp
 