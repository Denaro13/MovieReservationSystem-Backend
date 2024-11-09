import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import {
  createMovie,
  getMovies,
  getMoviesByGenre,
  getMoviesById,
} from "../controllers/movieController";

const movieRouter = Router();

movieRouter.get("/", authenticateUser, getMovies);
movieRouter.get("/:movieId", authenticateUser, getMoviesById);
// movieRouter.get(`/?genre=`, authenticateUser, getMoviesByGenre);
movieRouter.post(
  "/",
  authenticateUser,
  authorizePermissions("ADMIN"),
  createMovie
);

export default movieRouter;
