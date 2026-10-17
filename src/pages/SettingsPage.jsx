import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRotateLeft, faTextHeight } from "@fortawesome/free-solid-svg-icons";
import { PageHeading } from "../components/dashboard/DashboardUI";
import {
  defaultDisplaySettings,
  getDisplaySettings,
  saveDisplaySettings,
} from "../lib/displaySettings";

const textSizes = [
  { value: "small", label: "Small", sample: "Aa", note: "More content on screen" },
  { value: "default", label: "Default", sample: "Aa", note: "Recommended setting" },
  { value: "large", label: "Large", sample: "Aa", note: "Easier to read" },
];

function SettingsPage() {
  const [settings, setSettings] = useState(getDisplaySettings);

  const updateSettings = (changes) => {
    const nextSettings = { ...settings, ...changes };
    setSettings(nextSettings);
    saveDisplaySettings(nextSettings);
  };

  const resetSettings = () => {
    setSettings(defaultDisplaySettings);
    saveDisplaySettings(defaultDisplaySettings);
  };

  return (
    <>
      <PageHeading
        eyebrow="Preferences"
        title="Settings"
        description="Adjust how the store looks and feels on this device. Your choices are saved automatically."
        action={
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold transition hover:border-black hover:bg-zinc-50"
          >
            <FontAwesomeIcon icon={faRotateLeft} /> Reset defaults
          </button>
        }
      />

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <FontAwesomeIcon icon={faTextHeight} />
              </span>
              <div>
                <h2 className="text-lg font-bold">Text size</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">Choose a comfortable reading size. This changes text throughout the store.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {textSizes.map((option) => {
                const selected = settings.textSize === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateSettings({ textSize: option.value })}
                    className={`rounded-xl border p-4 text-left transition ${selected ? "border-black bg-zinc-50 ring-1 ring-black" : "border-zinc-200 hover:border-zinc-400"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${option.value === "small" ? "text-sm" : option.value === "large" ? "text-2xl" : "text-xl"}`}>{option.sample}</span>
                      {selected && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white"><FontAwesomeIcon icon={faCheck} /></span>}
                    </div>
                    <span className="mt-3 block text-sm font-semibold">{option.label}</span>
                    <span className="mt-1 block text-xs text-zinc-500">{option.note}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <h2 className="text-lg font-bold">Reduce motion</h2>
              <p className="mt-1 max-w-lg text-sm leading-6 text-zinc-500">Limit animations and transitions across the store.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.reduceMotion}
              aria-label="Reduce motion"
              onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${settings.reduceMotion ? "bg-black" : "bg-zinc-300"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.reduceMotion ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </section>
        </div>

        <aside className="overflow-hidden rounded-2xl bg-black p-6 text-white xl:sticky xl:top-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Live preview</p>
          <div className="mt-5 rounded-xl bg-white p-5 text-zinc-950">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nike member</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Find your pace.</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">Your text size preference updates across the page so you can preview how it feels.</p>
            <button type="button" className="mt-5 rounded-full bg-black px-4 py-2 text-xs font-bold text-white">Explore footwear</button>
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-400">Settings are saved in this browser and apply to your storefront pages.</p>
        </aside>
      </div>
    </>
  );
}

export default SettingsPage;
