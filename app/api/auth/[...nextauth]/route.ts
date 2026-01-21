import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { argon2id, verify } from "argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { logger } from "@/lib/logger.library";
import prismaWithExtends from "@/lib/prisma.library";
import { ENV_SERVER } from "@/schema/env.schema";
import { AuthSchema } from "@/schemas/auth.schema";
import { UserRole } from "@/lib/generated/prisma/enums";

export const runtime = "nodejs";

const handler = await NextAuth({
  adapter: PrismaAdapter(prismaWithExtends),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsed = AuthSchema.parse(credentials);
          const user = await prismaWithExtends.user.findUnique({
            where: { email: parsed.email },
          });
          if (!user) {
            return null;
          }
          const valid = await verify(user.password, parsed.password, {
            secret: ENV_SERVER.PASSWORD_SECRET,
          });
          if (!valid) {
            return null;
          }
          return {
            id: user.userId,
            email: user.email,
            name: user.username,
            role: user.role,
          };
        } catch (e) {
          logger.error("Error validation", e);
          if (e instanceof ZodError) {
            return null;
          }

          logger.error("Error auth", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: ENV_SERVER.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
