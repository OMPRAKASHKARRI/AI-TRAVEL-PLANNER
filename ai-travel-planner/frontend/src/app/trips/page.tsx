"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { TripCard } from "@/app/components/dashboard/TripCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Map, Compass } from "lucide-react";
import type { Trip } from "@/lib/types";
import * as api from "@/lib/api";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const data = await api.getAllTrips();
        setTrips(data);
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                My Trips
              </h1>
              <p className="text-muted-foreground mt-1">All your AI-generated travel plans</p>
            </div>
            <Button
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/20"
              onClick={() => router.push("/trips/generate")}
            >
              <Plus className="w-4 h-4 mr-2" /> New Trip
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <Card className="p-12 text-center border border-border/50">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Generate your first AI-powered trip plan</p>
              <Button
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                onClick={() => router.push("/trips/generate")}
              >
                <Plus className="w-4 h-4 mr-2" /> Generate First Trip
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
