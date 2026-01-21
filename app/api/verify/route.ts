import prismaWithExtends from "@/lib/prisma.library";
import { redis } from "@/lib/redis.library";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { f, l } = await req.json();

    if (
      typeof f !== "string" ||
      f.length < 10 ||
      typeof l !== "string" ||
      !/^LIC(-[A-Z0-9]{4}){3}$/.test(l)
    ) {
      return new Response("invalid");
    }
    const result = await prismaWithExtends.$transaction(async (tx) => {
      const lic = await tx.licenseKey.findUnique({
        where: { licenseKey: l },
        select: {
          licenseId: true,
          isExpired: true,
          fingerprint: true,
          limitSetting: { select: { limit: true } },
        },
      });

      if (!lic || !lic.limitSetting) return "invalid";
      if (lic.isExpired) return "expires";
      if (lic.fingerprint.includes(f)) return "valid";
      if (lic.fingerprint.length >= lic.limitSetting.limit) return "limit";

      await tx.licenseKey.update({
        where: { licenseId: lic.licenseId },
        data: { fingerprint: { push: f } },
      });

      await redis.del(`v1:license:${l}`);
      return "valid";
    });

    return new Response(result);
  } catch (e) {
    console.error(e);
    return new Response("invalid");
  }
}
