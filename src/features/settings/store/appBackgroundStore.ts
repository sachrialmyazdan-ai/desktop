import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppBackgroundMode = "off" | "gradient" | "solid" | "wallpaper";

type AppBackgroundState = {
  mode: AppBackgroundMode;
  color: string;
  secondColor: string;
  wallpaper: string | null;
  opacity: number;
  setMode: (mode: AppBackgroundMode) => void;
  setColor: (color: string) => void;
  setSecondColor: (color: string) => void;
  setWallpaper: (wallpaper: string | null) => void;
  setOpacity: (opacity: number) => void;
};

export const useAppBackgroundStore = create<AppBackgroundState>()(
  persist(
    (set) => ({
      mode: "gradient",
      color: "#17172f",
      secondColor: "#653b91",
      wallpaper: null,
      opacity: 0.42,
      setMode: (mode) => set({ mode }),
      setColor: (color) => set({ color }),
      setSecondColor: (secondColor) => set({ secondColor }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setOpacity: (opacity) => set({ opacity }),
    }),
    {
      name: "liner-app-background",
      partialize: (state) => ({
        mode: state.mode,
        color: state.color,
        secondColor: state.secondColor,
        wallpaper: state.wallpaper,
        opacity: state.opacity,
      }),
    },
  ),
);
