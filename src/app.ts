import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Application,
} from "express";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

//routers
import router from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import movieRouter from "./routes/moviesRoutes";
import errorHandlerMiddleWare from "./middlewares/error-handler";

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
app.use(errorHandlerMiddleWare as any);

// src/index.ts

// import prisma from "./database/db";

// async function main() {
//   // Create a new user
//   const newUser = await prisma.user.create({
//     data: {
//       name: "Usman Nurudeen",
//       email: "usman@example.com",
//     },
//   });

//   console.log("Created new user: ", newUser);

// Fetch all users
//   const allUsers = await prisma.user.findMany();
//   console.log("All users: ", allUsers);
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
