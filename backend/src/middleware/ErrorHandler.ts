import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/Error/error";
import { ZodError } from "zod";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error for debugging

    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.zodErrors
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};