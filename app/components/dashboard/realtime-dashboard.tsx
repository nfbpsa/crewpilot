"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase-client";

export default function RealtimeDashboard() {
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 Starting realtime...");

    const channel = supabaseClient
      .channel("calls-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calls",
        },
        (payload) => {
          console.log("🔥 Realtime event received:", payload);
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => {
      console.log("🛑 Removing realtime channel");
      supabaseClient.removeChannel(channel);
    };
  }, [router]);

  return null;
}