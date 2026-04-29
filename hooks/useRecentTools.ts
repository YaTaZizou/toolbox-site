"use client";

import { useState, useEffect } from "react";

export type RecentTool = {
  href: string;
  emoji: string;
  title: string;
  visitedAt: number;
};

const STORAGE_KEY = "toolbox_recent_tools";
const MAX_RECENT = 4;

export function getRecentTools(): RecentTool[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addRecentTool(tool: Omit<RecentTool, "visitedAt">) {
  const existing = getRecentTools().filter((t) => t.href !== tool.href);
  existing.unshift({ ...tool, visitedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_RECENT)));
}

export function useRecentTools() {
  const [tools, setTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    setTools(getRecentTools());
  }, []);

  return tools;
}
