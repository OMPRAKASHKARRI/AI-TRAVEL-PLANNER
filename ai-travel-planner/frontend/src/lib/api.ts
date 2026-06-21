import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// AUTH

export const login = async (credentials: any) => {
  const response = await API.post(
    "/auth/login",
    credentials
  );

  localStorage.setItem(
    "token",
    response.data.token
  );

  return response.data;
};
//register user
export const register = async (data: any) => {
  const response = await API.post(
    "/auth/register",
    data
  );

  localStorage.setItem(
    "token",
    response.data.token
  );

  return response.data;
};
//get currrent user
export const getCurrentUser = async () => {
  const response = await API.get(
    "/auth/me"
  );

  return response.data;
};
//change password
export const changePassword = async (
  data: any
) => {
  const response = await API.put(
    "/auth/change-password",
    data
  );

  return response.data;
};
//getDashboard stats
export const getDashboardStats = async () => {
  const response = await API.get(
    "/trips/dashboard/stats"
  );

  return response.data;
};
//get All trips
export const getAllTrips = async () => {
  const response = await API.get(
    "/trips"
  );

  return response.data;
};
// get trip
export const getTrip = async (
  tripId: string
) => {

  const response = await API.get(
    `/trips/${tripId}`
  );

  return response.data;
};
//generate trip
export const generateTrip = async (
  tripData: any
) => {

  const response = await API.post(
    "/trips/generate",
    {
      destination: tripData.destination,

      durationDays: tripData.days,

      budgetTier:
        tripData.budget.charAt(0).toUpperCase() +
        tripData.budget.slice(1),

      interests: tripData.interests,
    }
  );

  return response.data;
};
//add activity
export const addActivity = async (
  tripId: string,
  activityData: any
) => {

  const response = await API.post(
    `/trips/${tripId}/activity`,
    activityData
  );

  return response.data;
};
//remove activity
export const removeActivity = async (
  tripId: string,
  activityId: string
) => {

  const response = await API.delete(
    `/trips/${tripId}/activity/${activityId}`
  );

  return response.data;
};
// regenerate day
export const regenerateDay = async (
  tripId: string,
  dayNumber: number,
  instruction?: string
) => {

  const response = await API.post(
    `/trips/${tripId}/regenerate-day`,
    {
      dayNumber,
      instruction,
    }
  );

  return response.data;
};
//update packing item
export const updatePackingItem = async (
  tripId: string,
  itemId: string
) => {

  const response = await API.patch(
    `/trips/${tripId}/packing/${itemId}`
  );

  return response.data;
};
//delete trip
export const deleteTrip = async (
  tripId: string
) => {

  const response = await API.delete(
    `/trips/${tripId}`
  );

  return response.data;
};