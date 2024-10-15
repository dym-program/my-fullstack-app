"use client"; // 使用客户端组件

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import ImageSlider from '../components/slider';

export default function DashboardPage() {

  interface DecodedToken {
    email: string;
    // 添加其他字段
  }
  
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const TokenStr = jwtDecode<DecodedToken>(token);
      console.log("TokenStr=", TokenStr)
      setUser(TokenStr);
    } catch {
      console.error('Invalid token');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // 清除 cookie
    router.push('/login'); // 重定向到登录页面
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
            <p>Welcome, {user.email}</p> 
            <ImageSlider />
            <button onClick={handleLogout}>Logout</button>
        </div>
        ): <p>Loading...</p>}
    </div>
  );
}


