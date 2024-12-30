import type { MiddlewareHandler } from "hono";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof ZodError) {
      return c.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        400
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return c.json(
            {
              message: "Unique constraint violation",
              field: error.meta?.target,
            },
            409
          );
        case "P2025":
          return c.json(
            {
              message: "Record not found",
            },
            404
          );
        default:
          return c.json(
            {
              message: "Database error",
              code: error.code,
            },
            500
          );
      }
    }

    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  }
};
