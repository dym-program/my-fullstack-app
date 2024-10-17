"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import ImageSlider from '../components/slider';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name || 'User'}</p> 
      <img src={session.user?.image || ''} alt="User Avatar" style={{ width: '50px', borderRadius: '50%' }} />
      <ImageSlider />
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
