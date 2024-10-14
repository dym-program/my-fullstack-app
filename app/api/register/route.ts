import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  await dbConnect();

  // 检查用户是否已存在
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建新用户
  const newUser = new User({
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return NextResponse.json({ message: 'User registered successfully' });
}
