"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/staff");
  }, []);

  return null;
}