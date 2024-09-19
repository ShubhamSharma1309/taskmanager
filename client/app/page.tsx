"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '@/lib/redux/user/userSlice';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  //@ts-ignore
  const { currentUser, loading } = useSelector((state) => state.user);
  const { toast } = useToast();

  console.log('user ==> ', currentUser);
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(signOutUserSuccess());
        router.push('/sign-in');
        toast({
          title: "Success",
          description: "You have successfully signed out.",
        });
      } else {
        throw new Error(data.message || 'Failed to sign out');
      }
    } catch (error: any) {
      dispatch(signOutUserFailure(error.message));
      toast({
        title: "Error",
        description: "An error occurred while signing out. Please try again.",
        variant: "destructive",
      });
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center p-4">
        <h1>Task Manager</h1>
        <div>
          {currentUser ? (
            <>
              <span className="mr-4">Welcome, {currentUser.name}</span>
              <button onClick={handleSignOut} disabled={loading}>
                {loading ? 'Signing Out...' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/sign-in')} className="mr-2">Sign In</button>
              <button onClick={() => router.push('/sign-up')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}