import { CreateGroupModal } from "@/features/groups/components/CreateGroupModal";
import { GroupsEmptyState } from "@/features/groups/components/GroupsEmptyState";
import { GroupsList } from "@/features/groups/components/GroupsList";
import { GroupsPageHeader } from "@/features/groups/components/GroupsPageHeader";
import { useGroupsListPage } from "@/features/groups/hooks/useGroupsListPage";
import { getErrorMessage } from "@/lib/errors";

export function GroupsPage() {
  const controller = useGroupsListPage();
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <GroupsPageHeader onCreate={controller.openCreateModal} />
      {controller.error ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {getErrorMessage(controller.error)}
        </p>
      ) : null}
      {controller.isLoading ? (
        <p className="mt-10 text-slate-600">Cargando grupos...</p>
      ) : null}
      {!controller.isLoading && controller.groups.length === 0 ? (
        <div className="mt-8">
          <GroupsEmptyState />
        </div>
      ) : null}
      {controller.groups.length > 0 ? (
        <div className="mt-8">
          <GroupsList groups={controller.groups} />
        </div>
      ) : null}
      <CreateGroupModal
        error={controller.error}
        isCreating={controller.isCreating}
        isOpen={controller.isCreateModalOpen}
        onClose={controller.closeCreateModal}
        onCreate={controller.createGroup}
      />
    </section>
  );
}
