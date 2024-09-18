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