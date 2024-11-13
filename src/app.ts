import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

//Routers
import router from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import movieRouter from "./routes/moviesRoutes";

// Middlewares
import errorHandlerMiddleWare from "./middlewares/error-handler";
import notFound, { StatusError } from "./middlewares/not-found";

//initialize passport
app.use(passport.initialize());

app.get("/", (req: Request, res: Response) => {
  res.send("Movie Reservation System Backend");
});

// app.get(
//   "/protected",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.send(`Hello ${req.user ? req.user. : "Unknown User"}`);
//   }
// );

app.use(express.json());

// routes
app.use("/api/v1/auth", router);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/movies", movieRouter);

//error handling
app.use(notFound);
app.use(errorHandlerMiddleWare);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
