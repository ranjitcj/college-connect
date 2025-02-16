import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
    role?: string;
  }
}
