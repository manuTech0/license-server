import prismaWithExtends from "@/lib/prisma.library";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const expiresSet = await prismaWithExtends.licenseKey.updateMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
      isExpired: false,
    },
    data: {
      isExpired: true,
    },
  });
  const aliveSet = await prismaWithExtends.licenseKey.updateMany({
    where: {
      expiresAt: {
        gte: new Date(),
      },
      isExpired: true,
    },
    data: {
      isExpired: false,
    },
  });
  return new Response(
    JSON.stringify({
      aliveSet: aliveSet.count,
      expiresSet: expiresSet.count,
    }),
  );
}
