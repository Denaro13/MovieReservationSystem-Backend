import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import {
  addShowTimeToMovie,
  createMovie,
  getAvailableSeatsForMovieShowtime,
  getMovies,
  getMoviesByGenre,
  getMoviesById,
  getMovieShowTimes,
  seatReservationForMovieShowtime,
} from "../controllers/movieController";

const movieRouter = Router();

movieRouter.get("/", authenticateUser, getMovies);
movieRouter.get("/:movieId", authenticateUser, getMoviesById);
movieRouter.post(
  "/",
  authenticateUser,
  authorizePermissions("ADMIN"),
  createMovie
);
movieRouter.post(
  "/:movieId/showTime",
  authenticateUser,
  authorizePermissions("ADMIN"),
  addShowTimeToMovie
);
movieRouter.get(
  "/showTime/:showTimeId/availableSeats",
  authenticateUser,
  getAvailableSeatsForMovieShowtime
);
movieRouter.get("/:movieId/showTimes", authenticateUser, getMovieShowTimes);
movieRouter.post(
  "/showTimes/:showTimeId/reservations",
  authenticateUser,
  seatReservationForMovieShowtime
);
export default movieRouter;
