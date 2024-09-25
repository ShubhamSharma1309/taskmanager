"use client"
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { RootState } from "@/lib/redux/store";
import { signInFailure, signInStart, signInSuccess } from '@/lib/redux/user/userSlice';
import { RegisterCredentials, RegisterSchema } from '@/lib/types/user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ZodFormattedError } from "zod";

const SignUp = () => {
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ZodFormattedError<RegisterCredentials> | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    try {
      const validationResult = RegisterSchema.safeParse(formData);

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        setErrors(formattedErrors);
        return;
      }

      dispatch(signInStart());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      dispatch(signInSuccess(data));
      toast({
        title: "Success",
        description: "You have successfully signed up.",
        className: "backdrop-blur-md bg-background/80 border-2 border-green-800 rounded-md"
      });
      router.push('/');
    } catch (err: any) {
      dispatch(signInFailure(err.message || 'Failed to sign up'));
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred. Please try again.",
        className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
      });
      console.error('Sign up error:', err);
    }
  };

  return (
    <div className="w-full pt-40 flex flex-col items-center justify-center">
      <BackgroundLines className="absolute inset-0">
        <div className="absolute inset-0" />
      </BackgroundLines>
      <Card className="w-[350px] backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border border-primary/10">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name._errors[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email._errors[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                {errors?.password && <p className="text-red-500 text-xs mt-1">{errors.password._errors[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
                {errors?.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword._errors[0]}</p>}
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              className="text-primary hover:underline cursor-pointer"
              onClick={() => router.push('/sign-in')}
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
