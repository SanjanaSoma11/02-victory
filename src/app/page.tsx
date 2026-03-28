import Link from "next/link";
import { ArrowRight, HeartHandshake, Mic, FileText, Shield } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--color-primary)/0.25,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_50%_100%,var(--color-accent)/0.35,transparent_55%)]"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <HeartHandshake className="size-5" />
          </div>
          <span className="font-heading text-xl tracking-tight">Victory</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), "text-sm")}
          >
            Sign in
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants(), "gap-1.5 text-sm")}>
            Open app
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            Client case management — $0 stack
          </p>
          <h1 className="mt-6 font-heading text-4xl leading-[1.1] tracking-tight text-foreground md:text-6xl md:leading-[1.05]">
            Dignified care.{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Fundable proof.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            One workspace for client profiles, voice-powered visit notes, and grant-ready
            reports — Next.js, Supabase, Groq, and Vercel aligned with your hackathon
            architecture.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "min-w-[200px] gap-2")}>
              Launch dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/clients"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-w-[200px]")}
            >
              Browse clients
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Mic,
              title: "Voice → structured notes",
              body: "Groq Whisper and Llama turn recordings into summaries, action items, and risk cues.",
            },
            {
              icon: FileText,
              title: "Funder narratives",
              body: "Aggregate service data into polished report sections you can edit before export.",
            },
            {
              icon: Shield,
              title: "Supabase-ready",
              body: "RLS-friendly schema for profiles, clients, service entries, and generated reports.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm ring-1 ring-foreground/5 backdrop-blur transition hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-lg">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
