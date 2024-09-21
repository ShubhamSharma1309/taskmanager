"use client"
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { RootState } from "@/lib/redux/store";
import { signInFailure, signInStart, signInSuccess } from '@/lib/redux/user/userSlice';
import { SignInCredentials, SignInCredentialsSchema } from '@/lib/types/user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading} = useSelector((state: RootState) => state.user);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      const credentials: SignInCredentials = { email, password };
      const validationResult = SignInCredentialsSchema.safeParse(credentials);

      if (!validationResult.success) {
        const errors = Object.fromEntries(
          Object.entries(validationResult.error.format())
            .filter(([key, value]) => key !== '_errors' && typeof value === 'object' && '_errors' in value)
            .map(([key, value]) => [key, (value as { _errors: string[] })._errors.join(', ')])
        );
        setErrors(errors);
        return;
      }

      dispatch(signInStart());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      dispatch(signInSuccess(data));
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
      router.push('/');
    } catch (err: any) {
      dispatch(signInFailure(err.message || 'Failed to sign in'));
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        className: "backdrop-blur-md bg-background/80 border-2 border-red-800 rounded-md"
      });
      console.error('Login error:', err);
    }
  };

  return (
    <div className="w-full flex flex-col pt-40 items-center justify-center">
      <BackgroundLines className="absolute inset-0">
        <div className="absolute inset-0" />
      </BackgroundLines>
      <Card className="w-[350px] backdrop-blur-md bg-background/40 shadow-lg shadow-neutral-600/5 border border-primary/10">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              className="text-primary hover:underline cursor-pointer"
              onClick={() => router.push('/sign-up')}
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
