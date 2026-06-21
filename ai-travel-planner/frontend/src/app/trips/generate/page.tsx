"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, MapPin, Calendar, Wallet, Loader2, Utensils, Landmark, Mountain, ShoppingBag, TreePine, Moon, Check } from "lucide-react";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { VoiceInput } from "@/app/components/voice/VoiceInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Interest, BudgetType } from "@/lib/types";
import * as api from "@/lib/api";

const interestsConfig: { value: Interest; label: string; icon: React.ElementType }[] = [
  { value: "food", label: "Food", icon: Utensils },
  { value: "culture", label: "Culture", icon: Landmark },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "nature", label: "Nature", icon: TreePine },
  { value: "nightlife", label: "Nightlife", icon: Moon },
];

const generateSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  days: z.coerce.number().min(1, "At least 1 day").max(30, "Max 30 days"),
  budget: z.enum(["low", "medium", "high"]),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

type GenerateForm = z.infer<typeof generateSchema>;

export default function GenerateTripPage() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<GenerateForm>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      destination: "",
      days: 5,
      budget: "medium",
      interests: [],
    },
  });

  const selectedInterests = form.watch("interests") as Interest[];

  function toggleInterest(interest: Interest) {
    const current = selectedInterests || [];
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    form.setValue("interests", next, { shouldValidate: true });
  }

  function handleVoiceTranscript(transcript: string) {
    const lower = transcript.toLowerCase();
    let days = 5;
    const daysMatch = lower.match(/(\d+)\s*day/);
    if (daysMatch) days = parseInt(daysMatch[1], 10);

    let budget: BudgetType = "medium";
    if (lower.includes("low budget") || lower.includes("cheap")) budget = "low";
    if (lower.includes("high budget") || lower.includes("expensive") || lower.includes("luxury")) budget = "high";

    const interests: Interest[] = [];
    interestsConfig.forEach((cfg) => {
      if (lower.includes(cfg.value)) interests.push(cfg.value);
    });

    const destMatch = transcript.match(/(?:trip to|visit|plan a.*trip to|go to)\s+([A-Za-z\s]+?)(?:\s+trip|$|,\s+with|\s+and)/i);
    if (destMatch) {
      const dest = destMatch[1].trim();
      if (dest) form.setValue("destination", dest);
    }

    form.setValue("days", days);
    form.setValue("budget", budget);
    form.setValue("interests", interests);
  }

  async function onSubmit(data: GenerateForm) {
    setError("");
    setGenerating(true);
    try {
      const trip = await api.generateTrip({
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        interests: data.interests as Interest[],
      });
      router.push(`/trips/${trip._id}`);
    } catch (e) {
      setError("Failed to generate trip. Please try again.");
      setGenerating(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Generate Trip
            </h1>
            <p className="text-muted-foreground mt-1">Let AI plan your perfect adventure</p>
          </div>

          <Card className="border border-border/50 shadow-lg shadow-teal-100/10 dark:shadow-slate-900/20">
            <CardContent className="p-6 space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Voice Input</h3>
                <VoiceInput onTranscript={handleVoiceTranscript} />
                <p className="text-xs text-muted-foreground">
                  Try saying: &quot;Plan a 5 day Tokyo trip focused on food and culture with a medium budget&quot;
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="e.g., Tokyo, Paris, Bali" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Days</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input type="number" min={1} max={30} className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                  <Wallet className="w-4 h-4 text-muted-foreground" />
                                  <SelectValue placeholder="Select budget" />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low Budget</SelectItem>
                              <SelectItem value="medium">Medium Budget</SelectItem>
                              <SelectItem value="high">High Budget</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <FormMessage />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {interestsConfig.map((cfg) => {
                            const isSelected = selectedInterests?.includes(cfg.value);
                            return (
                              <button
                                key={cfg.value}
                                type="button"
                                onClick={() => toggleInterest(cfg.value)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all duration-200",
                                  isSelected
                                    ? "bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-950/40 dark:border-teal-700 dark:text-teal-300"
                                    : "bg-white border-border text-muted-foreground hover:border-teal-200 hover:text-teal-600 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-teal-800 dark:hover:text-teal-400"
                                )}
                              >
                                <cfg.icon className={cn("w-4 h-4", isSelected ? "text-teal-500" : "text-muted-foreground")} />
                                <span className="flex-1 text-left">{cfg.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-teal-500" />}
                              </button>
                            );
                          })}
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/20 transition-all duration-200 h-12 text-base"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI is generating your travel plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Trip
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
