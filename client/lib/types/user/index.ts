import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
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
  email: z.string().email(),
  password: z.string(),
});

export type SignInCredentials = z.infer<typeof SignInCredentialsSchema>;

export const SignUpCredentialsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data:any) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;
