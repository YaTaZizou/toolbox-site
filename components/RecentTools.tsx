"use client";

import Link from "next/link";
import { useRecentTools } from "@/hooks/useRecentTools";

export function RecentTools() {
  const tools = useRecentTools();

  if (tools.length === 0) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
        Récemment utilisés
      </p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-3 py-2 transition-all group hover:scale-[1.02]"
          >
            <span className="text-base">{tool.emoji}</span>
            <span className="text-gray-400 group-hover:text-white text-xs font-medium transition-colors">
              {tool.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
