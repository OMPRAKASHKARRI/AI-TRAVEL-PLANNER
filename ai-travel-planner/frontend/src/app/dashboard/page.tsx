"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Map, DollarSign, Sparkles, Plus, MapPin, Compass, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { StatsCard } from "@/app/components/dashboard/StatsCard";
import { TripCard } from "@/app/components/dashboard/TripCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats, Trip } from "@/lib/types";
import * as api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, tripsData] = await Promise.all([
          api.getDashboardStats(),
          api.getAllTrips(),
        ]);
        setStats(statsData);
        setRecentTrips(tripsData.slice(0, 5));
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="container mx-auto max-w-7xl px-6 py-8">          
    <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Plan your next adventure with AI</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Total Trips"
              value={stats?.totalTrips ?? 0}
              icon={Map}
              trend="All your adventures"
              gradient="bg-gradient-to-br from-teal-500 to-emerald-600"
              iconBg="from-teal-500"
              isLoading={loading}
            />
            <StatsCard
              title="Total Budget"
              value={stats?.totalBudget ? `$${stats.totalBudget.toLocaleString()}` : "$0"}
              icon={DollarSign}
              trend="Across all trips"
              gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              iconBg="from-cyan-500"
              isLoading={loading}
            />
            <StatsCard
              title="AI Generated"
              value={stats?.aiGeneratedTrips ?? 0}
              icon={Sparkles}
              trend="Powered by AI"
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              iconBg="from-amber-500"
              isLoading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  Recent Trips
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/trips")}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  View All
                </Button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : recentTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mx-auto mb-4">
                    <Compass className="w-8 h-8 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground">No trips yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Generate your first AI trip plan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrips.map((trip) => (
                    <TripCard key={trip._id} trip={trip} />
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/20"
                  onClick={() => router.push("/trips/generate")}
                >
                  <Plus className="w-4 h-4" />
                  Generate New Trip
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-950/30"
                  onClick={() => router.push("/trips")}
                >
                  <MapPin className="w-4 h-4" />
                  View My Trips
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-950/30"
                  onClick={() => router.push("/profile")}
                >
                  <Compass className="w-4 h-4" />
                  My Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
