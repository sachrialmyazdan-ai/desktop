import { useAppBackgroundStore } from "../store/appBackgroundStore";

export function AppBackground() {
  const mode = useAppBackgroundStore((state) => state.mode);
  const color = useAppBackgroundStore((state) => state.color);
  const secondColor = useAppBackgroundStore((state) => state.secondColor);
  const wallpaper = useAppBackgroundStore((state) => state.wallpaper);
  const opacity = useAppBackgroundStore((state) => state.opacity);

  if (mode === "off") return null;

  const backgroundImage =
    mode === "wallpaper" && wallpaper
      ? `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12)), url("${wallpaper}")`
      : mode === "solid"
        ? `linear-gradient(${color}, ${color})`
        : `linear-gradient(135deg, ${color}, ${secondColor}, ${color})`;

  return (
    <div
      aria-hidden="true"
      className={mode === "gradient" ? "liner-app-background liner-app-background--animated" : "liner-app-background"}
      style={{
        backgroundImage,
        opacity,
      }}
    />
  );
}
