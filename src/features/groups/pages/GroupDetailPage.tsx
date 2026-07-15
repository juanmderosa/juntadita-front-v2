import { AddGroupContactsPanel } from "@/features/groups/components/AddGroupContactsPanel";
import { DeleteGroupModal } from "@/features/groups/components/DeleteGroupModal";
import { DeleteGroupContactModal } from "@/features/groups/components/DeleteGroupContactModal";
import { GroupDetailHeader } from "@/features/groups/components/GroupDetailHeader";
import { GroupMembersList } from "@/features/groups/components/GroupMembersList";
import { GroupNameForm } from "@/features/groups/components/GroupNameForm";
import { useGroupDetailPage } from "@/features/groups/hooks/useGroupDetailPage";
import { getErrorMessage } from "@/lib/errors";

export function GroupDetailPage() {
  const controller = useGroupDetailPage();
  if (controller.isLoading)
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 text-slate-600 sm:px-8">
        Cargando grupo...
      </section>
    );
  if (!controller.group)
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 text-red-700 sm:px-8">
        {controller.error
          ? getErrorMessage(controller.error)
          : "No se encontró el grupo."}
      </section>
    );
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <GroupDetailHeader onDelete={controller.openDeleteModal} />
      {controller.error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {getErrorMessage(controller.error)}
        </p>
      ) : null}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <GroupNameForm
          isSaving={controller.isSavingName}
          name={controller.group.name}
          onSave={controller.saveName}
        />
        <p className="mt-3 text-sm text-slate-600">
          {controller.group.memberCount}{" "}
          {controller.group.memberCount === 1 ? "contacto" : "contactos"} en
          este grupo privado.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <AddGroupContactsPanel
          isAdding={controller.isAddingContacts}
          onAdd={controller.addContacts}
        />
        <GroupMembersList
          isRemoving={controller.isRemovingContact}
          members={controller.group.members}
          onRequestRemove={controller.requestContactDeletion}
        />
      </div>
      <DeleteGroupModal
        groupName={controller.group.name}
        isDeleting={controller.isDeleting}
        isOpen={controller.isDeleteModalOpen}
        onClose={controller.closeDeleteModal}
        onConfirm={controller.deleteGroup}
      />
      <DeleteGroupContactModal
        contact={controller.memberPendingDeletion}
        isDeleting={controller.isRemovingContact}
        onClose={controller.closeContactDeletion}
        onConfirm={controller.deleteContact}
      />
    </section>
  );
}
