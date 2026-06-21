export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export type BudgetType = 'low' | 'medium' | 'high';

export type Interest = 'food' | 'culture' | 'adventure' | 'shopping' | 'nature' | 'nightlife';

export interface TripFormData {
  destination: string;
  days: number;
  budget: BudgetType;
  interests: Interest[];
}

export interface estimatedBudget {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  total: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  costPerNight: number;
  tier: BudgetType;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timeOfDay: string;
  estimatedCost: number;
}

export interface DayPlan {
  dayNumber: number;
  activities: Activity[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

export interface Trip {
  _id: string;
  destination: string;
  days: number;
  budget: BudgetType;
  estimatedBudget: estimatedBudget;
  interests: Interest[];
  hotels: Hotel[];
  itinerary: DayPlan[];
  packingList: PackingItem[];
  createdAt: string;
  userId: string;
}

export interface DashboardStats {
  totalTrips: number;
  totalBudget: number;
  aiGeneratedTrips: number;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
