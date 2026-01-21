import { logger } from "@/lib/logger.library";
import prismaWithExtends from "@/lib/prisma.library";
import { ENV_SERVER } from "@/schema/env.schema";
import { argon2id, hash } from "argon2";

export default async function seedAdminUsers() {
  try {
    const hashedPassword = await hash(ENV_SERVER.ADMIN_PASSWORD, {
      secret: ENV_SERVER.PASSWORD_SECRET,
      memoryCost: 131072,
      type: argon2id,
      timeCost: 6,
      parallelism: 2,
    });
    logger.info("Creating admin...");
    await prismaWithExtends.user.upsert({
      where: { email: ENV_SERVER.ADMIN_EMAIL },
      create: {
        email: ENV_SERVER.ADMIN_EMAIL,
        password: hashedPassword,
        username: "admin",
        role: "ADMIN",
        emailVerified: true,
      },
      update: {
        email: ENV_SERVER.ADMIN_EMAIL,
        password: hashedPassword,
      },
    });
    logger.info("Admin creating!!!");
  } catch (e) {
    logger.error("seed error", e);
  }
}

seedAdminUsers()
  .catch(() => process.exit(1))
  .then(() => process.exit(0));
