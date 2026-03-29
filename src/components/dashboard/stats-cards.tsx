"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalClients?: number;
  totalEntries?: number;
  totalHours?: number;
  weeklyTrend?: { w: string; visits: number }[];
  servicesByType?: { name: string; n: number }[];
}

export function StatsCards({
  totalClients = 0,
  totalEntries = 0,
  totalHours = 0,
  weeklyTrend = [],
  servicesByType = [],
}: StatsCardsProps) {
  const stats = [
    {
      label: "Active clients",
      value: String(totalClients),
      hint: "Total registered",
      icon: Users,
    },
    {
      label: "Visits logged",
      value: String(totalEntries),
      hint: "All time",
      icon: ClipboardList,
    },
    {
      label: "Hours documented",
      value: String(totalHours),
      hint: "Last 6 weeks",
      icon: Clock,
    },
    {
      label: "Service types",
      value: String(servicesByType.length),
      hint: "Active categories",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <Card key={label} size="sm">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="size-4 text-primary" aria-hidden />
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-heading text-3xl tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Visit volume</CardTitle>
            <p className="text-sm text-muted-foreground">Weekly service entries — last 6 weeks</p>
          </CardHeader>
          <CardContent className="h-72 pt-0">
            {weeklyTrend.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No entries in the last 6 weeks
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="w" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#fillVisits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg">By service type</CardTitle>
            <p className="text-sm text-muted-foreground">Last 6 weeks</p>
          </CardHeader>
          <CardContent className="h-72 pt-0">
            {servicesByType.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={servicesByType} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={72}
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Bar dataKey="n" radius={[0, 6, 6, 0]} fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
