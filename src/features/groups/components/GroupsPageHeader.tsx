import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

type GroupsPageHeaderProps = { onCreate: () => void };

export function GroupsPageHeader({ onCreate }: GroupsPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Agenda personal</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Grupos y contactos
        </h1>
        <p className="mt-2 text-slate-600">
          Guardá contactos para invitarlos de nuevo cuando armes un evento.
        </p>
      </div>
      <Button onClick={onCreate} type="button">
        <FolderPlus aria-hidden="true" className="mr-2 inline size-4" />
        Crear grupo
      </Button>
    </header>
  );
}
