import type { ContactGroup } from "@/types/groups";

type InviteGroupsSelectorProps = {
  groups: ContactGroup[];
  onToggle: (groupId: string) => void;
  selectedGroupIds: string[];
  selectedMembersUpperBound: number;
};

export function InviteGroupsSelector({
  groups,
  onToggle,
  selectedGroupIds,
  selectedMembersUpperBound,
}: InviteGroupsSelectorProps) {
  if (groups.length === 0) return null;

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-800">
        Tus grupos
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {groups.map((group) => {
          const isSelected = selectedGroupIds.includes(group.id);
          return (
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${isSelected ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}
              key={group.id}>
              <input
                checked={isSelected}
                className="size-4 accent-indigo-600"
                onChange={() => onToggle(group.id)}
                type="checkbox"
              />
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {group.name}
                </span>
                <span className="block text-xs text-slate-500">
                  {group.memberCount} contactos
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {selectedGroupIds.length > 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          Seleccionaste {selectedGroupIds.length}{" "}
          {selectedGroupIds.length === 1 ? "grupo" : "grupos"}: hasta{" "}
          {selectedMembersUpperBound} contactos. Se omiten repetidos.
        </p>
      ) : null}
    </fieldset>
  );
}
