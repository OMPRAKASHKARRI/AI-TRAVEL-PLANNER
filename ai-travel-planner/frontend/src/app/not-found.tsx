import Link from "next/link";
import { Plane, Home, Map, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-100/5 dark:bg-teal-900/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg px-4 z-10">
        <Card className="border border-teal-100/50 dark:border-slate-700/50 shadow-2xl shadow-teal-100/20 dark:shadow-slate-900/20 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 p-12 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center mx-auto animate-pulse">
              <Plane className="w-12 h-12 text-teal-600 dark:text-teal-400 transform -rotate-45" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
              <span className="text-sm font-bold text-teal-700 dark:text-teal-300">404</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Lost Your Way?
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            The destination you are looking for seems to be off the map. Let us help you find your way back.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/20">
                <Home className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <Link href="/trips" className="w-full">
              <Button variant="outline" className="w-full border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-950/30">
                <Map className="w-4 h-4 mr-2" /> My Trips
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Compass className="w-4 h-4" />
            <span>AI Travel Planner</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
