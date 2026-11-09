import { useRef, useState } from "react";
import { useAppBackgroundStore, type AppBackgroundMode } from "../../store/appBackgroundStore";

const modes: { value: AppBackgroundMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "gradient", label: "Live gradient" },
  { value: "solid", label: "Solid color" },
  { value: "wallpaper", label: "Wallpaper" },
];

export function BackgroundSettings() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const mode = useAppBackgroundStore((state) => state.mode);
  const color = useAppBackgroundStore((state) => state.color);
  const secondColor = useAppBackgroundStore((state) => state.secondColor);
  const wallpaper = useAppBackgroundStore((state) => state.wallpaper);
  const opacity = useAppBackgroundStore((state) => state.opacity);
  const setMode = useAppBackgroundStore((state) => state.setMode);
  const setColor = useAppBackgroundStore((state) => state.setColor);
  const setSecondColor = useAppBackgroundStore((state) => state.setSecondColor);
  const setWallpaper = useAppBackgroundStore((state) => state.setWallpaper);
  const setOpacity = useAppBackgroundStore((state) => state.setOpacity);

  const chooseWallpaper = (file?: File) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 1_500_000) {
      setError("The image must be 1.5 MB or smaller to keep app settings storage safe.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setWallpaper(reader.result);
        setMode("wallpaper");
      } else {
        setError("Could not read this image.");
      }
    };
    reader.onerror = () => setError("Could not read this image.");
    reader.readAsDataURL(file);
  };

  return (
    <section className="mt-[18px] rounded-[14px] border border-border-primary bg-fill-subtle p-[14px]">
      <div className="mb-[10px]">
        <h3 className="text-[14px] font-[600] text-text-primary">Background &amp; wallpaper</h3>
        <p className="mt-[4px] text-[12px] text-text-secondary">
          Add a personal wallpaper or an animated color gradient behind the player.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-4">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            aria-pressed={mode === item.value}
            className={`rounded-[9px] border px-[8px] py-[9px] text-[12px] transition-colors ${
              mode === item.value
                ? "border-text-primary bg-fill-hover text-text-primary"
                : "border-border-primary bg-bg-surface text-text-secondary hover:bg-fill"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {(mode === "gradient" || mode === "solid") && (
        <div className="mt-[14px] flex flex-wrap items-center gap-[14px]">
          <label className="flex items-center gap-[8px] text-[12px] text-text-secondary">
            {mode === "solid" ? "Background color" : "First color"}
            <input
              aria-label="First background color"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              className="h-[30px] w-[42px] cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>
          {mode === "gradient" && (
            <label className="flex items-center gap-[8px] text-[12px] text-text-secondary">
              Second color
              <input
                aria-label="Second background color"
                type="color"
                value={secondColor}
                onChange={(event) => setSecondColor(event.target.value)}
                className="h-[30px] w-[42px] cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
          )}
        </div>
      )}

      <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            chooseWallpaper(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-[9px] bg-fill px-[12px] py-[9px] text-[12px] font-[500] text-text-primary hover:bg-fill-hover"
        >
          {wallpaper ? "Change wallpaper" : "Upload wallpaper"}
        </button>
        {wallpaper && (
          <button
            type="button"
            onClick={() => {
              setWallpaper(null);
              if (mode === "wallpaper") setMode("gradient");
            }}
            className="rounded-[9px] px-[10px] py-[9px] text-[12px] text-text-secondary hover:bg-fill"
          >
            Remove image
          </button>
        )}
        {error && <p role="alert" className="w-full text-[12px] text-red-400">{error}</p>}
      </div>

      <label className="mt-[14px] flex items-center gap-[12px] text-[12px] text-text-secondary">
        <span className="min-w-[88px]">Background strength</span>
        <input
          type="range"
          min="0.08"
          max="0.8"
          step="0.02"
          value={opacity}
          onChange={(event) => setOpacity(Number(event.target.value))}
          className="min-w-0 flex-1 accent-[var(--accent-primary)]"
        />
        <span className="w-[38px] text-right tabular-nums">{Math.round(opacity * 100)}%</span>
      </label>
      <p className="mt-[8px] text-[11px] text-text-tertiary">
        Wallpaper images are stored locally in this app profile. Images up to 1.5 MB are supported.
      </p>
    </section>
  );
}
