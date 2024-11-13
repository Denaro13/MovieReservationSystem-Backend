import { NextFunction, Request, Response } from "express";
import db from "../database/db";
import { StatusCodes } from "http-status-codes";
import UnAuthorizedError from "../errors/unauthorized";
import BadRequestError from "../errors/bad-request";
import { STATUS_CODES } from "http";
import bcrypt from "bcrypt";
import UnAuthenticatedError from "../errors/unauthenticated";

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      reservations: true,
      _count: true,
    },
  });

  const count = await db.user.count({});

  res.status(StatusCodes.OK).json({ users, count });
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = await db.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      reservations: true,
      _count: true,
    },
  });

  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `There is no user with id: ${id}` });
  }

  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "There is no logged in user" });
  }

  const userData = await db.user.findUnique({
    where: {
      id: parseInt(user.id),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      reservations: true,
      _count: true,
    },
  });

  res.status(StatusCodes.OK).json({ userData });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new BadRequestError("Please provide name and email"));
  }

  const userAvailable = await db.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!userAvailable) {
    return next(new BadRequestError(`There is no user with id:${id}`));
  }

  const emailInUse = await db.user.findUnique({
    where: {
      email,
    },
  });

  console.log(emailInUse);

  if (emailInUse?.id !== parseInt(id)) {
    return next(new BadRequestError("Email already in use by another user"));
  }

  const user = await db.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      reservations: true,
      createdAt: true,
    },
  });

  res
    .status(StatusCodes.ACCEPTED)
    .json({ user, msg: "User data updated successfully" });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await db.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `There is no user with id: ${id}` });
    }
    res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new BadRequestError("Please provide currentPassword and newPassword")
    );
  }

  const activeUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!activeUser) {
    return next(new UnAuthorizedError("Request fail"));
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    activeUser.password
  );

  if (!isPasswordValid) {
    return next(
      new UnAuthenticatedError(
        "The provided currentPassword does not match user's current password"
      )
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await db.user.update({
    where: {
      id: activeUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
};
