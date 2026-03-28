import type { ReactNode } from "react";

interface AppHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-background/80 px-6 py-6 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
