import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(
    `${req.method} ${req.originalUrl} not found`
  ) as StatusError;
  //   res.status(404).send("Route does not exist");
  error["status"] = 404;
  next(error);
};

export default notFound;

export interface StatusError extends Error {
  status?: number;
}
