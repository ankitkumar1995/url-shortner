import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export interface AnalyticsResponse {
  shortCode: string;
  totalClicks: number;
  timeSeries: { date: string; clicks: number }[];
  demographics: {
    countries: Record<string, number>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
  };
}

/**
 * Mutation Hook to shorten long URLs and update store.
 */
export const useShortenLink = () => {
  const addLink = useLinkStore((state) => state.addRecentLink);

  return useMutation<LinkRecord, Error, ShortenRequest>({
    mutationFn: async (data) => {
      const response = await api.post("/api/v1/shorten", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      addLink(data);
    },
  });
};

/**
 * Query Hook to retrieve telemetry logs for a shortened link.
 */
export const useLinkAnalytics = (shortCode: string) => {
  return useQuery<AnalyticsResponse, Error>({
    queryKey: ["analytics", shortCode],
    queryFn: async () => {
      const response = await api.get(`/api/v1/analytics/${shortCode}`);
      return response.data;
    },
    enabled: !!shortCode,
    refetchInterval: 10000, // Dynamic polling: refresh analytics every 10s
    retry: 2,
  });
};
