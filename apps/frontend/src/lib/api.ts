import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLinkStore, LinkRecord } from "../store/useLinkStore";

// Axios Client instance targeting backend Express gateway
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export interface ShortenRequest {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface AnalyticsOverview {
  totalClicks: number;
  activeLinks: number;
  slaSyncRatio: string;
  avgLatencyMs: string;
}

export interface ClickDataPoint {
  time: string;
  clicks: number;
}

export interface DeviceDataPoint {
  name: string;
  clicks: number;
  percentage: number;
  value: number;
  fill: string;
}

/**
 * Mutation Hook to shorten long URLs and update store.
 */
export const useShortenLink = () => {
  const addLink = useLinkStore((state) => state.addRecentLink);
  const queryClient = useQueryClient();

  return useMutation<LinkRecord, Error, ShortenRequest>({
    mutationFn: async (data) => {
      const response = await api.post("/api/v1/shorten", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      addLink(data);
      // Invalidate both links list and overview caches to trigger instant UI refresh!
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["analytics", "overview"] });
    },
  });
};

/**
 * Query Hook to retrieve all active short links dynamically.
 */
export const useAllLinks = () => {
  const setLinksStore = useLinkStore((state) => state.setRecentLinks);

  return useQuery<LinkRecord[], Error>({
    queryKey: ["links"],
    queryFn: async () => {
      const response = await api.get("/api/v1/links");
      const data = response.data.data;
      setLinksStore(data);
      return data;
    },
    refetchInterval: 5000, // Dynamic Polling: sync link listings every 5s
    retry: 2,
  });
};

/**
 * Query Hook to retrieve overall Overview analytical metrics.
 */
export const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await api.get("/api/v1/analytics/overview");
      return response.data;
    },
    refetchInterval: 4000, // Poll every 4 seconds for live totals
  });
};

/**
 * Query Hook to retrieve click logs time-series for chart renders.
 */
export const useAnalyticsClicks = () => {
  return useQuery<ClickDataPoint[], Error>({
    queryKey: ["analytics", "clicks"],
    queryFn: async () => {
      const response = await api.get("/api/v1/analytics/clicks");
      return response.data;
    },
    refetchInterval: 4000, // Poll every 4 seconds to stream graph updates
  });
};

/**
 * Query Hook to retrieve user device/browser segmentations.
 */
export const useAnalyticsDevices = () => {
  return useQuery<DeviceDataPoint[], Error>({
    queryKey: ["analytics", "devices"],
    queryFn: async () => {
      const response = await api.get("/api/v1/analytics/devices");
      return response.data;
    },
    refetchInterval: 5000,
  });
};

/**
 * Query Hook to retrieve geographic country data.
 */
export const useAnalyticsCountries = () => {
  return useQuery<Record<string, number>, Error>({
    queryKey: ["analytics", "countries"],
    queryFn: async () => {
      const response = await api.get("/api/v1/analytics/countries");
      return response.data;
    },
    refetchInterval: 6000,
  });
};

/**
 * Query Hook to retrieve referrers.
 */
export const useAnalyticsReferrers = () => {
  return useQuery<Record<string, number>, Error>({
    queryKey: ["analytics", "referrers"],
    queryFn: async () => {
      const response = await api.get("/api/v1/analytics/referrers");
      return response.data;
    },
    refetchInterval: 6000,
  });
};
