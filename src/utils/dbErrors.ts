import { sendError } from "./errors.js";
//import { req, res } from "express";

// handle mongoose error response
export function databaseErrors(error: any) {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));

    return { statusCode: 400, message: "error validation", errors };
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `${field} already exists`;

    return {
      statusCode: 400,
      message: `the field: ${field} alredy exists.`,
    };
  }

  // Invalid ObjectId
  if (error.name === "CastError") {
    return {
      statucCode: 400,
      message: "format of the ID is invalid?",
    };
  }
}
