import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGroupMutations,
  useGroups,
} from "@/features/groups/hooks/useGroups";

export function useGroupsListPage() {
  const navigate = useNavigate();
  const groupsQuery = useGroups();
  const { create } = useGroupMutations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function createGroup(name: string) {
    const group = await create.mutateAsync(name);
    setIsCreateModalOpen(false);
    navigate(`/groups/${group.id}`);
  }

  return {
    groups: groupsQuery.data ?? [],
    isCreateModalOpen,
    isCreating: create.isPending,
    isLoading: groupsQuery.isLoading,
    error: groupsQuery.error ?? create.error,
    openCreateModal: () => setIsCreateModalOpen(true),
    closeCreateModal: () => setIsCreateModalOpen(false),
    createGroup,
  };
}
