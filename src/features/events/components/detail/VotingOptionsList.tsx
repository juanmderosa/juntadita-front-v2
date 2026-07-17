import type { VotingOption } from "@/types/events";
import { VotingOptionCard } from "@/features/events/components/detail/VotingOptionCard";

type VotingOptionsListProps = {
  isOpen: boolean;
  compact?: boolean;
  onToggle: (optionId: string) => void;
  options: VotingOption[];
  selectedOptionIds: string[];
  timeZone: string;
};

export function VotingOptionsList({
  isOpen,
  compact = false,
  onToggle,
  options,
  selectedOptionIds,
  timeZone,
}: VotingOptionsListProps) {
  return (
    <ul className="mt-5 space-y-3">
      {options.map((option) => (
        <VotingOptionCard
          isOpen={isOpen}
          isSelected={selectedOptionIds.includes(option.id)}
          compact={compact}
          key={option.id}
          onToggle={() => onToggle(option.id)}
          option={option}
          timeZone={timeZone}
        />
      ))}
    </ul>
  );
}
