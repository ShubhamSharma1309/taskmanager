import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../utils/Error";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err instanceof ValidationError ? err.errors : undefined
        });
    }

    if (err instanceof ZodError) {
        const validationError = new ValidationError(err);
        return res.status(validationError.statusCode).json({
            success: false,
            message: validationError.message,
            errors: validationError.errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err instanceof Error && 'errors' in err
                ? Object.values((err as any).errors).map((e: any) => ({
                    field: e.path,
                    message: e.message
                }))
                : []
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};