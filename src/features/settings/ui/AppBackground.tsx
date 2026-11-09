import { useAppBackgroundStore } from "../store/appBackgroundStore";

export function AppBackground() {
  const enabled = useAppBackgroundStore((state) => state.enabled);
  const color = useAppBackgroundStore((state) => state.color);
  const secondColor = useAppBackgroundStore((state) => state.secondColor);
  const opacity = useAppBackgroundStore((state) => state.opacity);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="liner-app-background liner-app-background--animated"
      style={{
        backgroundImage: `linear-gradient(135deg, ${color}, ${secondColor}, ${color})`,
        opacity,
      }}
    />
  );
}
