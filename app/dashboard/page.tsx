"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import ImageSlider from '../components/slider';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false); // 用于判断是否为客户端环境
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 表示客户端环境
  }, []);

  useEffect(() => {
    if (isClient && !session) {
      router.push('/login'); // 客户端环境且无 session 时，跳转到登录页
    }
  }, [isClient, session, router]);

  if (!isClient || !session) {
    return <p>Loading...</p>; // 在未判断是否为客户端或无 session 时，显示加载状态
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
