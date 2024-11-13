import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import CustomApiError from "../errors/custom-api";
import { Prisma } from "@prisma/client";
import { prismaError } from "prisma-better-errors";
import { StatusError } from "./not-found";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  console.log("Hi, I got here");
  if (err.status === 404) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Route not found",
    });
  }

  if (err instanceof CustomApiError) {
    res.status((err as any).statusCode || 400).json({
      message: err.message,
    });
  }
  if (err instanceof prismaError) {
    res.status(err.statusCode).json({
      title: err.title,
      message: err.message,
      metaData: err.metaData,
    });
  }

  // Known request errors with specific codes
  // if (err instanceof Prisma.PrismaClientKnownRequestError) {
  //   if (err.code === "P2025") {
  //     console.error("Record not found:", err);
  //     throw new Error("The requested record could not be found."); // Custom error message
  //   } else if (err.code === "P2002") {
  //     console.error("Unique constraint failed:", err);
  //     throw new Error("A unique constraint violation occurred.");
  //   }
  // } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
  //   console.error("Unknown error:", err);
  //   throw new Error("An unknown error occurred while processing your request.");
  // } else if (err instanceof Prisma.PrismaClientInitializationError) {
  //   console.error("Initialization error:", err);
  //   throw new Error("There was an error initializing the database connection.");
  // } else if (err instanceof Prisma.PrismaClientRustPanicError) {
  //   console.error("Rust panic error:", err);
  //   throw new Error("An unexpected error occurred. Please try again later.");
  // } else if (err instanceof Prisma.PrismaClientValidationError) {
  //   console.error("Validation error:", err);
  //   throw new Error("There was a validation error with the data provided.");
  // } else {
  //   console.error("Unexpected error:", err);
  //   throw new Error("An unexpected error occurred.");
  // }

  // return res.status(500).json({
  //   message: "Something went wrong!",
  // });

  if (err.code === "P2000")
    res.status(500).json({
      success: false,
      message: `Record does not exist ${err.meta.target}`,
    });
  else if (err.code === "P2001")
    res.status(500).json({
      success: false,
      message: `Unique constraint violation on: ${err.meta.target}`,
    });
  else if (err.code === "P2002")
    res.status(500).json({
      success: false,
      message: `Unique constraint violation on a property: ${err.meta.target}`,
    });
  else if (err.code === "P2025")
    res.status(500).json({ success: false, message: err.meta.cause });
  else if (err.code === "P2026")
    res.status(500).json({
      success: false,
      message: `Input value for ${err.meta.target} is required but not provided`,
    });
  else if (err.code === "P2027")
    res
      .status(500)
      .json({ success: false, message: `Foreign key constraint violation!` });
  else if (err.code === "P3000")
    res.status(500).json({
      success: false,
      message: `Constraint violation on: ${err.meta.target}`,
    });
  else if (err.code === "P3001")
    res.status(500).json({ success: false, message: `Internal Server err` });
  else if (err.code === "P3002")
    res.status(500).json({ success: false, message: `Connection err!` });
  else if (err.code === "P3003" || err.code === "P2010")
    res.status(500).json({ success: false, message: `Connection Timeout` });
  else if (err.code === "P3004")
    res.status(500).json({ success: false, message: `Connection Timeout` });
  else
    res.status(500).json({ success: false, message: "Internal Server Error" });
  // if (
  // 	error.name === "PrismaClientInitializationError" ||
  // 	error.name === "PrismaClientKnownRequestError" ||
  // 	error.name === "PrismaClientUnKnownRequestError" ||
  // 	error.name === "TypeError" ||
  // 	error.name === "PrismaClientValidationError" ||
  // 	error.name === "Error"
  // ) {
  // 	res.status(500).json({ success: false, message: error.message });
  // } else {
  // 	console.error(error);
  // 	res.status(error.status).json({ success: false, message: error.message });
  // }
};

export default errorHandlerMiddleWare;
