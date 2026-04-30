import { Card, CardContent } from "@/components/ui/card";
import { Star, type LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isPremium?: boolean;
}

export function ToolCard({ title, description, icon: Icon, isPremium }: ToolCardProps) {
  return (
    <Card className="group cursor-pointer border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:bg-card">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Icon className="h-6 w-6" />
          </div>
          {isPremium && (
            <div className="flex items-center gap-1 rounded-full bg-premium/10 px-2 py-1 text-xs font-medium text-premium">
              <Star className="h-3 w-3 fill-premium" />
              Premium
            </div>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
