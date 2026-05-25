import { create } from "zustand";

export interface LinkRecord {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt: string | null;
  createdAt: string;
}

interface LinkStoreState {
  recentLinks: LinkRecord[];
  activeFilter: "all" | "active" | "expired";
  addRecentLink: (link: LinkRecord) => void;
  setRecentLinks: (links: LinkRecord[]) => void;
  setActiveFilter: (filter: "all" | "active" | "expired") => void;
  clearStore: () => void;
}

export const useLinkStore = create<LinkStoreState>((set) => ({
  recentLinks: [],
  activeFilter: "all",

  addRecentLink: (link) =>
    set((state) => {
      // Prevent duplicates in state
      const filtered = state.recentLinks.filter((l) => l.shortCode !== link.shortCode);
      return { recentLinks: [link, ...filtered].slice(0, 10) }; // Keep top 10
    }),

  setRecentLinks: (links) => set({ recentLinks: links }),

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  clearStore: () => set({ recentLinks: [], activeFilter: "all" }),
}));
