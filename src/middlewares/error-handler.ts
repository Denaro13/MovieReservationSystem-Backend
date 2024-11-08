import { NextFunction, Request, Response } from "express";
import CustomApiError from "../errors/custom-api";

const errorHandlerMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const customError={
  //     statusCode:err.st
  // }
  console.log(err);

  if (err instanceof CustomApiError) {
    return res.status((err as any).statusCode || 400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Something went wrong!",
  });
};

export default errorHandlerMiddleWare;
