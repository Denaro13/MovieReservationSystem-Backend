import { NextFunction, Request, Response } from "express";
import db from "../database/db";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { genre } = req.query;
  console.log(typeof genre);

  let movies;

  movies = await db.movie.findMany({
    include: {
      genre: true,
      showTimes: true,
      _count: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (genre) {
    movies = await db.movie.findMany({
      where: {
        genre: {
          name: {
            equals: genre as string,
            mode: "insensitive",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      include: {
        showTimes: true,
        genre: true,
      },
    });
  }

  res.status(StatusCodes.OK).json({ movies, message: "Successful" });
};

export const getMoviesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { movieId } = req.params;

  const movie = await db.movie.findFirst({
    where: {
      id: parseInt(movieId),
    },
    include: {
      genre: true,
      showTimes: true,
    },
  });

  res.status(StatusCodes.OK).json({ movie });
};

export const getMoviesByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { genre } = req.params;

  const movies = await db.movie.findMany({
    where: {
      genre: {
        name: {
          equals: genre,
          mode: "insensitive",
        },
      },
    },
    orderBy: {
      id: "asc",
    },
    include: {
      showTimes: true,
      genre: true,
    },
  });
  // res.status(StatusCodes.OK).json({ movies });
};

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, genre } = req.body;

  if (!title || !description || !genre) {
    return next(
      new BadRequestError("Please include title, description and genre")
    );
  }
  const movie = await db.movie.create({
    data: {
      title,
      description,
      genre: {
        create: { name: genre },
      },
      showTimes: {
        create: [
          { dateTime: new Date("2024-12-01T15:00:00Z") },
          { dateTime: new Date("2024-12-01T18:00:00Z") },
        ],
      },
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ movie, message: "Movie created successfully" });
};
