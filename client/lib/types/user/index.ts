import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UserStateSchema = z.object({
  currentUser: UserSchema.nullable(),
  loading: z.boolean(),
  error: z.string().nullable(),
});

export type UserState = z.infer<typeof UserStateSchema>;

export const SignInCredentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;

export const SignUpCredentialsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password should be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;
