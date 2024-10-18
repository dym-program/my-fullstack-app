import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import redis from '@/lib/redis';
import User from '@/models/User';
import  mongooseConnect  from '@/lib/mongodb';
export async function POST(req: Request) {
  const { email, password } = await req.json();
  // 首先连接数据库
  await mongooseConnect();

  // 查询数据库验证用户
  const user = await User.findOne({ email });
  
  if (!user || !(bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 如果验证成功，生成 JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  // 将会话信息存储到 Redis 中，1小时过期
  await redis.set(
    `session-${user._id}`, 
    JSON.stringify({ token, userId: user._id }), 
    'EX', 
    3600
  );

  // 设置 cookies 返回给客户端
  const response = NextResponse.json({ message: 'Login successful',token });
  response.cookies.set('token', token, {maxAge: 3600 });
  return response;
}
