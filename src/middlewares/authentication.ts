import { NextFunction, Request, Response } from "express";
import UnAuthenticatedError from "../errors/unauthenticated";
import jwt, { JwtPayload } from "jsonwebtoken";
import UnAuthorizedError from "../errors/unauthorized";

type Payload = {
  userId: string;
  email: string;
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnAuthenticatedError("Authentication invalid"));
  }

  const token = authHeader.split(" ")[1];

  const secretKey =
    "f81eae361e0a19df15381cdb68a6bc11234ad5f15f0bdb00368438a0cad9e567";

  try {
    const payload = jwt.verify(token, secretKey) as JwtPayload;

    const user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    res.locals.user = user;
    next();
  } catch (error) {
    next(new UnAuthenticatedError("Authentication invalid"));
  }
};

export const authorizePermissions = (role: "ADMIN" | "USER") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (role !== res.locals.user.role) {
      return next(new UnAuthorizedError("Unauthorized to access this route"));
    }
    next();
  };
};
