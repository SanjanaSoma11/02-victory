import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Mic,
  FileText,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Mic,
    title: "Voice → structured notes",
    body: "Speech-to-text plus structured drafting turns session audio into editable summaries, action items, and risk cues.",
    accent: "from-primary/20 to-chart-2/10",
  },
  {
    icon: FileText,
    title: "Funder-ready reports",
    body: "Aggregate visits into grant-style narratives grounded in your real service data.",
    accent: "from-chart-2/20 to-primary/10",
  },
  {
    icon: Sparkles,
    title: "Client summary",
    body: "One-click handoff brief: background, services to date, status, needs, and next steps.",
    accent: "from-chart-3/15 to-chart-1/10",
  },
];

export default function HomePage() {
  return (
    <div className="landing-victory relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="landing-victory-grain" aria-hidden />
      <div
        className="landing-orb pointer-events-none absolute -top-32 right-[-10%] size-[min(560px,90vw)] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.14_160/0.35),transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="landing-orb pointer-events-none absolute bottom-0 left-[-15%] size-[min(480px,85vw)] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.12_195/0.3),transparent_60%)] blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/20">
            <HeartHandshake className="size-5" aria-hidden />
          </div>
          <span className="font-heading text-xl tracking-tight text-foreground">Victory</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "text-sm")}>
            Sign in
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ variant: "outline" }), "hidden text-sm sm:inline-flex")}>
            Sign up
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants(), "gap-1.5 text-sm shadow-md shadow-primary/15")}>
            Open app
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-12 pt-4 md:pb-20 md:pt-8">
        <div className="mx-auto w-full max-w-3xl flex-1 text-center">
          <p className="text-xs text-muted-foreground">Next.js · Supabase · Vercel</p>

          <h1 className="mt-6 font-heading text-[2.15rem] leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.05]">
            Case notes that{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                keep up with reality
              </span>
              <span
                className="absolute -inset-x-1 -bottom-1 z-0 h-3 rounded bg-gradient-to-r from-primary/25 via-chart-2/20 to-transparent md:h-4"
                aria-hidden
              />
            </span>
            —and proof funders can read.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
            Human-first case workspace: fast intake, voice capture with structured drafts, grant-ready reporting, and
            client handoff summaries—built for nonprofit teams.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-w-[220px] gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
              )}
            >
              Launch dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/clients" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-w-[200px]")}>
              Browse clients
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-6xl flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body, accent }) => (
            <div
              key={title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm ring-1 ring-foreground/[0.04] backdrop-blur transition duration-300",
                "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 transition group-hover:opacity-100",
                  accent
                )}
                aria-hidden
              />
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm ring-1 ring-border/60">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h2 className="mt-4 font-heading text-lg leading-snug text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-4xl flex-1 flex-col items-center justify-end gap-6 rounded-3xl border border-dashed border-primary/25 bg-gradient-to-br from-card via-card to-primary/[0.04] px-6 py-8 text-center sm:mt-16 md:flex-row md:text-left">
          <div className="max-w-xl space-y-2">
            <p className="font-heading text-xl text-foreground">Ready when you are</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Open the dashboard for clients, visits, reports, and calendar. Connect your database and optional API keys
              for live transcription and drafting.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link href="/reports" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2")}>
              <FileText className="size-4" />
              Reports
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Sign in
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <footer className="mt-auto border-t border-border/60 pt-8 text-center text-xs text-muted-foreground">
          <p>
            Victory · Open source for nonprofits ·{" "}
            <Link
              href="https://github.com/2026-ASU-WiCS-Opportunity-Hack/02-victory"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Source on GitHub
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
