import prismaWithExtends from "@/lib/prisma.library";
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
      return new Response("0i");
    }
    const data = await prismaWithExtends.licenseKey.findLicense(l);
    if (data) {
      if (data.isExpired) return new Response("0e");
      if (!data.valid) return new Response("0l");
      await prismaWithExtends.licenseKey.update({
        where: { licenseId: data.licId },
        data: {
          fingerprint: {
            push: f,
          },
        },
      });
      return new Response("1");
    } else {
      return new Response("0i");
    }
  } catch {
    return new Response("0i");
  }
}
