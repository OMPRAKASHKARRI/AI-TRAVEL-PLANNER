"use client";

import Link from "next/link";
import { MapPin, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Trip } from "@/lib/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function budgetLabel(budget: string) {
  return { low: "Low", medium: "Medium", high: "High" }[budget] || budget;
}

function budgetBadgeClass(budget: string) {
  const map: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    high: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };
  return map[budget] || "";
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="group border border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <Link href={`/trips/${trip._id}`} className="block">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{trip.destination}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {trip.days} days
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(trip.createdAt)}
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${budgetBadgeClass(trip.budget)}`}>
              {budgetLabel(trip.budget)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-sm font-medium">
              <DollarSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
               formatCurrency(trip.estimatedBudget?.total || 0)            
</div>
            <div className="flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 font-medium group-hover:translate-x-1 transition-transform">
              View
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
