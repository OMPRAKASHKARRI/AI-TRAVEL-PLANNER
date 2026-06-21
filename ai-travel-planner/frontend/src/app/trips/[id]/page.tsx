"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet, ArrowLeft, Plus, Trash2, RefreshCw, Check, Backpack, Clock, DollarSign, Star, Hotel, ChevronDown, ChevronUp } from "lucide-react";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Trip, Activity, DayPlan } from "@/lib/types";
import * as api from "@/lib/api";
import { cn } from "@/lib/utils";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");

  const tripId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    async function loadTrip() {
      if (!tripId) return;
      setLoading(true);
      try {
        const data = await api.getTrip(tripId);
        if (data) {
          setTrip(data);
        } else {
          setError("Trip not found");
        }
      } catch {
        setError("Failed to load trip");
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  const packedCount = trip?.packingList.filter((p) => p.packed).length || 0;
  const totalPackItems = trip?.packingList.length || 0;
  const packProgress = totalPackItems > 0 ? Math.round((packedCount / totalPackItems) * 100) : 0;

  async function handleRegenerateDay(dayNumber: number) {
    if (!tripId) return;
    setRegeneratingDay(dayNumber);
    try {
      const updated = await api.regenerateDay(tripId, dayNumber);
      setTrip(updated);
    } catch {
      setError("Failed to regenerate day");
    } finally {
      setRegeneratingDay(null);
    }
  }

  async function handleRemoveActivity(dayNumber: number, activityId: string) {
    if (!tripId) return;
    try {
const updated = await api.removeActivity(
  tripId,
  activityId
);      
setTrip(updated);
    } catch {
      setError("Failed to remove activity");
    }
  }

  async function handleAddActivity(dayNumber: number, activity: Omit<Activity, "id">) {
    if (!tripId) return;
    try {
const updated = await api.addActivity(
  tripId,
  activity
);     
 setTrip(updated);
    } catch {
      setError("Failed to add activity");
    }
  }

  async function togglePackItem(itemId: string, packed: boolean) {
    if (!tripId) return;
    try {
const updated = await api.updatePackingItem(
  tripId,
  itemId
);
      setTrip(updated);
    } catch {
      setError("Failed to update item");
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !trip) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-semibold">{error || "Trip not found"}</h1>
            <Button onClick={() => router.push("/trips")} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Trips
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => router.push("/trips")}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {trip.destination}
              </h1>
              <Badge className={`border ${budgetBadgeClass(trip.budget)}`}>
                {budgetLabel(trip.budget)} Budget
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.days} days</span>
              <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> {formatCurrency(trip.estimatedBudget.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-xl font-bold">{formatCurrency(trip.estimatedBudget.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hotels</p>
                    <p className="text-xl font-bold">{trip.hotels.length} suggestions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Backpack className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Packing</p>
                    <p className="text-xl font-bold">{packProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-background border border-border/50">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="packing">Packing</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-4">
              {trip.itinerary.map((day) => (
                <DayCard
                  key={day.dayNumber}
                  day={day}
                  tripId={tripId}
                  onRegenerate={() => handleRegenerateDay(day.dayNumber)}
                  regenerating={regeneratingDay === day.dayNumber}
                  onRemoveActivity={(activityId) => handleRemoveActivity(day.dayNumber, activityId)}
                  onAddActivity={(activity) => handleAddActivity(day.dayNumber, activity)}
                />
              ))}
            </TabsContent>

            <TabsContent value="budget">
              <BudgetCard budget={trip.estimatedBudget} />
            </TabsContent>

            <TabsContent value="hotels">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trip.hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="packing">
              <PackingCard
                items={trip.packingList}
                progress={packProgress}
                onToggle={togglePackItem}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function DayCard({
  day,
  
  onRegenerate,
  regenerating,
  onRemoveActivity,
  onAddActivity,
}: {
  day: DayPlan;
  tripId: string;
  onRegenerate: () => void;
  regenerating: boolean;
  onRemoveActivity: (id: string) => void;
  onAddActivity: (activity: Omit<Activity, "id">) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [newActivity, setNewActivity] = useState({ title: "", description: "", timeOfDay: "Morning", estimatedCost: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="border border-border/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold">
              {day.dayNumber}
            </span>
            Day {day.dayNumber}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={regenerating} className="text-teal-600 hover:text-teal-700 dark:text-teal-400">
              <RefreshCw className={cn("w-4 h-4 mr-1", regenerating && "animate-spin")} />
              {regenerating ? "Regenerating..." : "Regenerate"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-3 pt-0">
              {day.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onRemove={() => onRemoveActivity(activity.id)} />
              ))}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full border-dashed border-teal-300 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-950/30">
                    <Plus className="w-4 h-4 mr-1" /> Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Activity - Day {day.dayNumber}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="Activity name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} placeholder="Description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Time of Day</Label>
                        <Select value={newActivity.timeOfDay} onValueChange={(v) => setNewActivity({ ...newActivity, timeOfDay: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Morning">Morning</SelectItem>
                            <SelectItem value="Late Morning">Late Morning</SelectItem>
                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                            <SelectItem value="Late Afternoon">Late Afternoon</SelectItem>
                            <SelectItem value="Evening">Evening</SelectItem>
                            <SelectItem value="Night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Cost ($)</Label>
                        <Input type="number" value={newActivity.estimatedCost} onChange={(e) => setNewActivity({ ...newActivity, estimatedCost: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                      onClick={() => {
                        if (newActivity.title) {
                          onAddActivity(newActivity);
                          setNewActivity({ title: "", description: "", timeOfDay: "Morning", estimatedCost: 0 });
                          setDialogOpen(false);
                        }
                      }}
                    >
                      Add Activity
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function ActivityCard({ activity, onRemove }: { activity: Activity; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 border border-border/50 hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0">
        <Clock className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm truncate">{activity.title}</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-red-500" onClick={onRemove}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <Badge variant="secondary" className="text-xs">{activity.timeOfDay}</Badge>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
            <DollarSign className="w-3 h-3" />{activity.estimatedCost}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function BudgetCard({ budget }: { budget: { transport: number; accommodation: number; food: number; activities: number; total: number } }) {
  const items = [
    { label: "Transport", value: budget.transport, icon: "🚗", color: "bg-teal-500" },
    { label: "Accommodation", value: budget.accommodation, icon: "🏨", color: "bg-cyan-500" },
    { label: "Food", value: budget.food, icon: "🍽️", color: "bg-emerald-500" },
    { label: "Activities", value: budget.activities, icon: "🎯", color: "bg-amber-500" },
  ];

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Wallet className="w-5 h-5 text-teal-600" /> Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item) => {
          const pct = budget.total > 0 ? (item.value / budget.total) * 100 : 0;
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(item.value)}</span>
              </div>
              <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{formatCurrency(budget.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function HotelCard({ hotel }: { hotel: { id: string; name: string; rating: number; costPerNight: number; tier: string } }) {
  return (
    <Card className="border border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{hotel.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(hotel.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground")} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">{hotel.rating}</span>
            </div>
          </div>
          <Badge variant="outline" className={budgetBadgeClass(hotel.tier)}>
            {budgetLabel(hotel.tier)}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Per night</span>
          <span className="font-semibold text-teal-600 dark:text-teal-400">{formatCurrency(hotel.costPerNight)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function PackingCard({
  items,
  progress,
  onToggle,
}: {
  items: { id: string; name: string; category: string; packed: boolean }[];
  progress: number;
  onToggle: (id: string, packed: boolean) => void;
}) {
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Backpack className="w-5 h-5 text-teal-600" /> Packing List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Packing Progress</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">{category}</h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                      item.packed
                        ? "bg-teal-50/50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800"
                        : "bg-white border-border hover:border-teal-200 dark:bg-slate-900 dark:hover:border-teal-800"
                    )}
                    onClick={() => onToggle(item.id, !item.packed)}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        item.packed
                          ? "bg-teal-500 border-teal-500"
                          : "border-muted-foreground"
                      )}
                    >
                      {item.packed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn("text-sm", item.packed && "line-through text-muted-foreground")}>
                      {item.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

