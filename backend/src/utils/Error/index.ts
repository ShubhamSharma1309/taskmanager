import { ZodError } from 'zod';

export default class ErrorHandler extends Error {
    statusCode: number;
    zodErrors?: { field: string; message: string }[];

    constructor(statusCode: number, message: string, zodError?: ZodError) {
        super(message);
        this.statusCode = statusCode;
        if (zodError) {
            this.zodErrors = zodError.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
        }
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    errors: { field: string; message: string }[];

    constructor(zodError: ZodError) {
        super('Validation Error', 400);
        this.errors = zodError.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}