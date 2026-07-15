import { FormEvent, useEffect, useState } from "react";
import { FolderPlus, Pencil, Trash2, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/errors";
import {
  parseInviteEmails,
  getInviteEmailsValidationError,
} from "@/features/events/lib/eventParticipants.lib";
import {
  useGroup,
  useGroupMutations,
  useGroups,
} from "@/features/groups/hooks/useGroups";

export function GroupsPage() {
  const groupsQuery = useGroups();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailQuery = useGroup(selectedId);
  const mutations = useGroupMutations();
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");
  const [emailsText, setEmailsText] = useState("");

  console.log(selectedId);

  useEffect(() => {
    if (!selectedId && groupsQuery.data?.[0])
      setSelectedId(groupsQuery.data[0].id);
  }, [groupsQuery.data, selectedId]);

  console.log(selectedId);

  useEffect(
    () => setEditName(detailQuery.data?.name ?? ""),
    [detailQuery.data?.name],
  );

  async function createGroup(event: FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const group = await mutations.create.mutateAsync(name);
    setNewName("");
    setSelectedId(group.id);
  }
  async function addMembers(event: FormEvent) {
    event.preventDefault();
    if (!selectedId) return;
    const emails = parseInviteEmails(emailsText);
    const error = getInviteEmailsValidationError(emails);
    if (error) return;
    await mutations.addMembers.mutateAsync({ groupId: selectedId, emails });
    setEmailsText("");
  }
  async function renameGroup(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !editName.trim()) return;
    await mutations.update.mutateAsync({
      groupId: selectedId,
      name: editName.trim(),
    });
  }
  async function deleteGroup() {
    if (
      !selectedId ||
      !window.confirm("¿Eliminar este grupo y todos sus contactos?")
    )
      return;
    await mutations.remove.mutateAsync(selectedId);
    setSelectedId(null);
  }

  const error =
    groupsQuery.error ??
    detailQuery.error ??
    mutations.create.error ??
    mutations.update.error ??
    mutations.remove.error ??
    mutations.addMembers.error ??
    mutations.removeMember.error;
  const memberValidationError = emailsText
    ? getInviteEmailsValidationError(parseInviteEmails(emailsText))
    : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Agenda personal
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Grupos y contactos
          </h1>
          <p className="mt-2 text-slate-600">
            Guardá contactos para invitarlos de nuevo cuando armes un evento.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => void createGroup(event)}>
          <input
            aria-label="Nombre del nuevo grupo"
            className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Ej. Amigos"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
          <Button
            disabled={mutations.create.isPending}
            type="submit">
            <FolderPlus className="mr-2 inline size-4" />
            Crear grupo
          </Button>
        </form>
      </div>
      {error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {getErrorMessage(error)}
        </p>
      ) : null}
      {groupsQuery.isLoading ? (
        <p className="mt-10 text-slate-600">Cargando grupos...</p>
      ) : null}
      {!groupsQuery.isLoading && groupsQuery.data?.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-10 text-center">
          <Users className="mx-auto size-9 text-indigo-600" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Tu agenda está vacía
          </h2>
          <p className="mt-2 text-slate-600">
            Creá un grupo para tener a tus contactos habituales siempre a mano.
          </p>
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          {groupsQuery.data?.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedId(group.id)}
              className={`rounded-2xl border bg-white p-5 text-left shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 ${selectedId === group.id ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                  <Users className="size-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Privado
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                {group.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {group.memberCount}{" "}
                {group.memberCount === 1 ? "contacto" : "contactos"}
              </p>
            </button>
          ))}
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          {detailQuery.isLoading ? (
            <p className="text-slate-600">Cargando contactos...</p>
          ) : null}
          {detailQuery.data ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-950">
                  {detailQuery.data.name}
                </h2>
                <button
                  aria-label="Eliminar grupo"
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"
                  onClick={() => void deleteGroup()}
                  type="button">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => void renameGroup(event)}>
                <input
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                />
                <Button
                  disabled={mutations.update.isPending}
                  variant="secondary"
                  type="submit">
                  <Pencil className="size-4" />
                </Button>
              </form>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900">Agregar contactos</h3>
                <form
                  className="mt-3 space-y-3"
                  onSubmit={(event) => void addMembers(event)}>
                  <textarea
                    className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    placeholder="ana@mail.com, juan@mail.com"
                    value={emailsText}
                    onChange={(event) => setEmailsText(event.target.value)}
                  />
                  {memberValidationError ? (
                    <p className="text-sm text-red-700">
                      {memberValidationError}
                    </p>
                  ) : null}
                  <Button
                    disabled={
                      mutations.addMembers.isPending ||
                      Boolean(memberValidationError)
                    }
                    type="submit">
                    <UserPlus className="mr-2 inline size-4" />
                    Agregar contactos
                  </Button>
                </form>
              </div>
              <ul className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
                {detailQuery.data.members.map((member) => (
                  <li
                    className="flex items-center justify-between gap-3 py-3"
                    key={member.id}>
                    <span className="truncate text-sm font-medium text-slate-700">
                      {member.email}
                    </span>
                    <button
                      aria-label={`Quitar ${member.email}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700"
                      onClick={() =>
                        void mutations.removeMember.mutateAsync({
                          groupId: detailQuery.data!.id,
                          memberId: member.id,
                        })
                      }
                      type="button">
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {detailQuery.data.members.length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">
                  Este grupo todavía no tiene contactos.
                </p>
              ) : null}
            </>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
