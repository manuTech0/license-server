"use client";
import React from "react";
import { Dashboard } from "@/components/Dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function App() {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session?.user) {
    router.replace("/login");
    return <>Gagal</>;
  }
  if (session.user.role !== "ADMIN") {
    router.replace("/login");
    return <>Gagal</>;
  }
  return <Dashboard />;
}

export default App;
