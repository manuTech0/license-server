"use client";
import { SessionProvider as RawSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  return <RawSessionProvider>{children}</RawSessionProvider>;
}
