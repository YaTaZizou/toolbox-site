"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { addRecentTool } from "@/hooks/useRecentTools";
import { ALL_TOOLS } from "@/data/tools";

export function ToolTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/") return;
    // Match on exact href or href without query params
    const tool = ALL_TOOLS.find(
      (t) => t.href === pathname || pathname.startsWith(t.href + "/")
    );
    if (tool && tool.available) {
      addRecentTool({ href: tool.href, emoji: tool.emoji, title: tool.title });
    }
  }, [pathname]);

  return null;
}
