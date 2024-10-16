import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; // 你的 MongoDB 连接逻辑

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { 
        params: { scope: 'read:user user:email' } // 请求 GitHub 的信息
      }
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt', // 使用 JWT 作为会话
  },
  callbacks: {
    async signIn({ user, account }) {
      // 在用户首次登录时处理
      return true;
    },
    async session({ session, token, user }) {
      session.user.id = token.id; // 将用户 ID 添加到 session 中
      return session;
    },
  },
});
