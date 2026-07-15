import type { ContactGroup } from "@/types/groups";
import { GroupCard } from "@/features/groups/components/GroupCard";

type GroupsListProps = { groups: ContactGroup[] };

export function GroupsList({ groups }: GroupsListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard
          group={group}
          key={group.id}
        />
      ))}
    </div>
  );
}
