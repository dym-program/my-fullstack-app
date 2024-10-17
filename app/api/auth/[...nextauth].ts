import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import  mongoClientPromise   from '../../../lib/mongodb';
import User from '@/models/User'; 

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { 
        params: { scope: 'read:user user:email' } 
      }
    }),
  ],
  adapter: MongoDBAdapter(mongoClientPromise()),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, profile }: { user: any, profile?: any }) {
      const githubNickname = profile?.name || user.name;
      const githubAvatar = profile?.avatar_url || user.image;

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          githubNickname,
          githubAvatar,
        });
      } else {
        existingUser.githubNickname = githubNickname;
        existingUser.githubAvatar = githubAvatar;
        await existingUser.save();
      }

      return true;
    },
    
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }: { session: any, token: any }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
