"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient: string;
  iconBg: string;
  isLoading?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, gradient, iconBg, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="p-8 border border-border/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 border border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-default group">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400">
              {value}
            </h3>
            {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
          </div>
          <div className={`p-3 rounded-xl ${gradient} ${iconBg} shadow-lg shadow-teal-500/10 group-hover:shadow-teal-500/20 transition-shadow`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
