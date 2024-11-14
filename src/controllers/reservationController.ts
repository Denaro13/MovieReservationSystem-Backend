import { NextFunction, Request, Response } from "express";
import db from "../database/db";
import BadRequestError from "../errors/bad-request";
import { StatusCodes } from "http-status-codes";

export const seatReservationForAShowTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { showTimeId } = req.params;

  const user = res.locals.user;
  const { seatNumbers } = req.body;

  const seats = await db.seat.findMany({
    where: {
      seatNumber: { in: seatNumbers },
      showTimeId: parseInt(showTimeId),
      isAvailable: true,
    },
  });

  if (seats.length !== seatNumbers.length) {
    return next(new BadRequestError("Some seats are not available."));
  }

  const reservation = await db.reservation.create({
    data: {
      user: { connect: { id: user.id as number } },
      showtime: { connect: { id: parseInt(showTimeId) } },
      seats: { connect: seats.map((seat) => ({ id: seat.id })) }, // Reserve all seats at once
    },
    include: {
      user: true,
      seats: true,
      showtime: true,
    },
  });

  // Update seat availability status
  await db.seat.updateMany({
    where: { id: { in: seats.map((seat) => seat.id) } },
    data: { isAvailable: false, isResearved: true },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: "Seat(s) reserved successfully", reservation });
};

export const getAllReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reservations = await db.reservation.findMany({
      include: {
        seats: true,
        showtime: {
          select: {
            date: true,
            startTime: true,
            endTime: true,
            movie: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    res.status(StatusCodes.OK).json({ reservations });
  } catch (error) {
    next(error);
  }
};
