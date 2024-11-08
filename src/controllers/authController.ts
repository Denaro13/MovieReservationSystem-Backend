import db from "../database/db";
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/bad-request";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UnAuthenticatedError from "../errors/unauthenticated";
import { signToken } from "../utils/creat-token";
import { use } from "passport";

export const register = async (
  req: Request<{}>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please include name, email and password"));
  }

  const userWithEmail = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithEmail) {
    return next(new BadRequestError(`User with email: ${email} already exist`));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db.user.create({
    data: {
      name,
      email,
      role: "USER",
      password: hashedPassword,
    },
  });

  const token = await signToken(user.id, user.name, user.email, user.role);

  res.status(StatusCodes.CREATED).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    msg: "User account created",
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide email and password"));
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new UnAuthenticatedError("Invalid credentials"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new UnAuthenticatedError("Invalid password"));
  }
  const token = await signToken(user.id, user.name, user.email, user.role);

  res.status(StatusCodes.OK).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    msg: "Login successful",
  });
};

// export const logout = async ()=>{

// }
