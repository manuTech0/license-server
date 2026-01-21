import { PrismaPg } from "@prisma/adapter-pg";
import ms from "ms";
import { Pool } from "pg";
import { ENV_SERVER } from "@/schema/env.schema";
import { PrismaClient } from "./generated/prisma/client";
import { redis } from "./redis.library";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const pool = new Pool({ connectionString: ENV_SERVER.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ENV_SERVER.NODE_ENV !== "production" ? ["query"] : ["error"],
    adapter,
  });
if (ENV_SERVER.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type FindLicenseResult = {
  valid: boolean;
  isExpired: boolean;
  licId: string;
};

const prismaWithExtends = prisma.$extends({
  name: "license-extension",
  model: {
    licenseKey: {
      async findLicense(licenseKey: string): Promise<FindLicenseResult | null> {
        const cacheKey = `license:${licenseKey}`;
        const cacheLicense = await redis.get(cacheKey);
        if (cacheLicense) {
          return JSON.parse(cacheLicense);
        }
        const license = await prisma.licenseKey.findFirst({
          where: { licenseKey },
          select: {
            limitSetting: {
              select: {
                limit: true,
              },
            },
            licenseId: true,
            licenseKey: true,
            fingerprint: true,
            isExpired: true,
          },
        });
        if (!license) return null;
        const transformedData: FindLicenseResult = {
          isExpired: license.isExpired,
          valid:
            licenseKey === license.licenseKey &&
            license.fingerprint.length >= license.limitSetting.limit,
          licId: license.licenseId,
        };
        await redis.set(
          cacheKey,
          JSON.stringify(transformedData),
          "EX",
          Math.floor(ms("20m") / 1000),
        );
        return transformedData;
      },
    },
  },
});

export { prisma as prismaWithExtends };
export default prismaWithExtends;
