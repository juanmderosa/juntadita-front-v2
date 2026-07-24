import {
  generatorPresets,
  type GeneratorPreset,
} from "@/features/events/lib/eventOptionGenerator.lib";

type EventOptionPresetSelectorProps = {
  applyPreset: (preset: GeneratorPreset) => void;
};

export function EventOptionPresetSelector({ applyPreset }: EventOptionPresetSelectorProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">Atajos</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {generatorPresets.map((preset) => (
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
            key={preset.value}
            onClick={() => applyPreset(preset.value)}
            type="button"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
