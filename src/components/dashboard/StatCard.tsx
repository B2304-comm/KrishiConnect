import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard = ({ title, value, change, trend = "neutral", icon: Icon, iconColor = "text-primary" }: StatCardProps) => {
  return (
    <div className="glass-panel group rounded-[26px] p-5 md:p-6 surface-outline transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
          <p className="text-2xl font-extrabold tracking-tight text-foreground md:text-[2rem]">{value}</p>
          {change && (
            <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/60 px-3 py-1.5 backdrop-blur-xl">
              {trend === "up" && <TrendingUp className="w-4 h-4 text-primary" />}
              {trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
              <span className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-soft transition-transform duration-300 group-hover:scale-105", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
