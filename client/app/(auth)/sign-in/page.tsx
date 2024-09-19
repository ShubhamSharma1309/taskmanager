"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '@/lib/redux/user/userSlice';
import { SignInCredentials, SignInCredentialsSchema } from '@/lib/types/user';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const dispatch = useDispatch();
  //@ts-ignore
  const { loading, error } = useSelector((state) => state.user);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const credentials: SignInCredentials = { email, password };
      const validationResult = SignInCredentialsSchema.safeParse(credentials);

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format();
        const stringErrors: { [key: string]: string } = {};
        Object.entries(formattedErrors).forEach(([key, value]) => {
          if (key !== '_errors' && typeof value === 'object' && '_errors' in value) {
            stringErrors[key] = value._errors.join(', ');
          }
        });
        setErrors(stringErrors);
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

      dispatch(signInSuccess(data.user));
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
      router.push('/');
    } catch (err: any) {
      console.log(err);
      if (err instanceof AxiosError) {
        if (err.response && err.response.data && err.response.data.errors) {
          const newErrors: { [key: string]: string } = {};
          err.response.data.errors.forEach((error: { field: string; message: string }) => {
            newErrors[error.field] = error.message;
          });
          setErrors(newErrors);
        } else if (err.response && err.response.data && err.response.data.message) {
          setErrors({ general: err.response.data.message });
        } else {
          setErrors({ general: "An error occurred during sign in." });
        }
      } else {
        setErrors({ general: "An unexpected error occurred during sign in." });
      }
      dispatch(signInFailure(err.message || 'Failed to sign in'));
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
