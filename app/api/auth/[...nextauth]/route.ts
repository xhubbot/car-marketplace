import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
          throw new Error("Account is temporarily locked. Try again later.");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          console.log("Password is wrong for user:", user.email);
          console.log("Current failed attempts:", user.failedLoginAttempts);

          // Increase failed attempts
          const newAttempts = user.failedLoginAttempts + 1;
          const shouldLock = newAttempts >= 5;

          console.log("New attempts will be:", newAttempts);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newAttempts,
              lockUntil: shouldLock
                ? new Date(Date.now() + 15 * 60 * 1000) // lock for 15 minutes
                : null,
            },
          });
          
          console.log("Update finished");
          return null;
        }

        // Login successful → reset attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockUntil: null,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" },
})

export { handler as GET, handler as POST }