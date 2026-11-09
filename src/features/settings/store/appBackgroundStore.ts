import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppBackgroundState = {
  enabled: boolean;
  color: string;
  secondColor: string;
  opacity: number;
  setEnabled: (enabled: boolean) => void;
  setColor: (color: string) => void;
  setSecondColor: (color: string) => void;
  setOpacity: (opacity: number) => void;
};

export const useAppBackgroundStore = create<AppBackgroundState>()(
  persist(
    (set) => ({
      enabled: true,
      color: "#17172f",
      secondColor: "#653b91",
      opacity: 0.42,
      setEnabled: (enabled) => set({ enabled }),
      setColor: (color) => set({ color }),
      setSecondColor: (secondColor) => set({ secondColor }),
      setOpacity: (opacity) => set({ opacity }),
    }),
    {
      name: "liner-app-background",
      partialize: (state) => ({
        enabled: state.enabled,
        color: state.color,
        secondColor: state.secondColor,
        opacity: state.opacity,
      }),
    },
  ),
);
