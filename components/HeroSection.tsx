import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
          50+ Free Tools Available
        </div>

        {/* Headline with gradient */}
        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            All Your Online Tools
          </span>
          <br />
          <span className="text-foreground">In One Place</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Convert PDFs, compress images, generate AI content, and transform text — all for free, 
          directly in your browser. No signup required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 px-8">
            Explore Tools
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            View All Categories
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">50+</p>
            <p className="text-sm text-muted-foreground">Free Tools</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">1M+</p>
            <p className="text-sm text-muted-foreground">Monthly Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">99.9%</p>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}
