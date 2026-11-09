import { useAppBackgroundStore } from "../store/appBackgroundStore";

export function BackgroundSettings() {
  const enabled = useAppBackgroundStore((state) => state.enabled);
  const color = useAppBackgroundStore((state) => state.color);
  const secondColor = useAppBackgroundStore((state) => state.secondColor);
  const opacity = useAppBackgroundStore((state) => state.opacity);
  const setEnabled = useAppBackgroundStore((state) => state.setEnabled);
  const setColor = useAppBackgroundStore((state) => state.setColor);
  const setSecondColor = useAppBackgroundStore((state) => state.setSecondColor);
  const setOpacity = useAppBackgroundStore((state) => state.setOpacity);

  return (
    <section className="mt-[18px] rounded-[14px] border border-border-primary bg-fill-subtle p-[14px]">
      <div className="mb-[12px] flex items-center justify-between gap-[12px]">
        <div>
          <h3 className="text-[14px] font-[600] text-text-primary">Live gradient background</h3>
          <p className="mt-[4px] text-[12px] text-text-secondary">
            An animated two-color gradient behind the player.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition-colors ${enabled ? "bg-[var(--accent-primary)]" : "bg-fill-hover"}`}
        >
          <span
            className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${enabled ? "translate-x-[21px]" : "translate-x-[3px]"}`}
          />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-[14px]">
        <label className="flex items-center gap-[8px] text-[12px] text-text-secondary">
          First color
          <input
            aria-label="First gradient color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-[30px] w-[42px] cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>
        <label className="flex items-center gap-[8px] text-[12px] text-text-secondary">
          Second color
          <input
            aria-label="Second gradient color"
            type="color"
            value={secondColor}
            onChange={(event) => setSecondColor(event.target.value)}
            className="h-[30px] w-[42px] cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>
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
    </section>
  );
}
