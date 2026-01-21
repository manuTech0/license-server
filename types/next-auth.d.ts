import { UserRole } from "@/lib/generated/prisma/enums";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user?: string | null;
      email?: string | null;
      role?: UserRole | null;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: UserRole;
  }
  interface JWT {
    role?: UserRole;
  }
}
