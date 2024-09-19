import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password should be at least 8 characters" }),
});