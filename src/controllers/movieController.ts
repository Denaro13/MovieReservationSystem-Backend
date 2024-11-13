import { NextFunction, Request, Response } from "express";
import db from "../database/db";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import { start } from "repl";
import { calculateEndTime } from "../utils/helpers";

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { genre } = req.query;

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

  const isGenreAvailable = await db.genre.findFirst({
    where: {
      name: genre,
    },
  });

  let validId = isGenreAvailable?.id;

  if (!isGenreAvailable) {
    const createdGenre = await db.genre.create({
      data: {
        name: genre,
      },
    });
    validId = createdGenre.id;
  }

  const movie = await db.movie.create({
    data: {
      title,
      description,
      genreId: validId as number,
      showTimes: {
        create: [],
      },
    },
    include: {
      genre: true,
      showTimes: true,
      _count: true,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ movie, message: "Movie created successfully" });
};

export const addShowTimeToMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { movieId } = req.params;
  const { date, startTime } = req.body;

  if (!date || !startTime) {
    return next(new BadRequestError("Please include date and startTime"));
  }

  const movie = await db.movie.findFirst({
    where: {
      id: parseInt(movieId),
    },
  });

  if (!movie) {
    return next(new BadRequestError(`There is no movie with id: ${movieId}`));
  }

  const endTime = calculateEndTime(startTime, 90);

  const createdShowTime = await db.showTime.create({
    data: {
      date: date,
      startTime: startTime,
      endTime: endTime,
      movie: {
        connect: { id: movie.id },
      },
    },
    include: {
      movie: {
        select: {
          title: true,
          description: true,
          movieLength: true,
          genre: {
            select: {
              name: true,
            },
          },
        },
      },
      seats: true,
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: "Show time added successfully", createdShowTime });
};
export const getMovieShowTimes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { movieId } = req.params;

  const validId = await db.movie.findFirst({
    where: {
      id: parseInt(movieId),
    },
  });

  if (!validId) {
    return next(new BadRequestError(`There is no movie with id:${movieId}`));
  }

  const showTimes = await db.showTime.findMany({
    where: {
      movieId: parseInt(movieId),
    },
  });

  res.status(StatusCodes.OK).json({ message: "Successful", showTimes });
};

export const seatReservationForMovieShowtime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  console.log(user);
};

// if (!Array.isArray(showTimes)) {
//   res.status(400).json({ error: "ShowTimes should be an array of objects" });
//   return;
// }

// const data = showTimes.map((showTime) => {
//   const startTime = new Date(showTime.dateTime);
//   console.log(startTime.toUTCString());

//   const endTime = new Date(startTime);
//   // console.log(endTime);
//   endTime.setMinutes(startTime.getMinutes() + 90);
//   console.log(endTime.toLocaleString());
// });

// try {
//   const createdShowTimes = await Promise.all(
//     showTimes.map(async (showTime) => {
//       return db.showTime.create({
//         data: {
//           date: new Date(showTime.dateTime),
//           startTime: new Date(showTime.dateTime).toISOString().slice(11, 16),
//           endTime: new Date(showTime.dateTime),
//           movie: {
//             connect: { id: parseInt(movieId) },
//           },
//         },
//       });
//     })
//   );

//   res
//     .status(201)
//     .json({ message: "ShowTimes added successfully", createdShowTimes });
// } catch (error) {
//   res.status(500).json({ error: "Error creating showTimes", details: error });
// }
