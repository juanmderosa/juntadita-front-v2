import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGroup, useGroupMutations } from "@/features/groups/hooks/useGroups";
import type { ContactGroupMember } from "@/types/groups";

export function useGroupDetailPage() {
  const { groupId = "" } = useParams();
  const navigate = useNavigate();
  const groupQuery = useGroup(groupId);
  const mutations = useGroupMutations();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberPendingDeletion, setMemberPendingDeletion] = useState<ContactGroupMember | null>(
    null,
  );
  async function deleteGroup() {
    await mutations.remove.mutateAsync(groupId);
    navigate("/groups");
  }
  async function deleteContact() {
    if (!memberPendingDeletion) return;
    await mutations.removeMember.mutateAsync({
      groupId,
      memberId: memberPendingDeletion.id,
    });
    setMemberPendingDeletion(null);
  }
  return {
    group: groupQuery.data,
    isLoading: groupQuery.isLoading,
    error:
      groupQuery.error ??
      mutations.update.error ??
      mutations.addMembers.error ??
      mutations.removeMember.error ??
      mutations.remove.error,
    isSavingName: mutations.update.isPending,
    isAddingContacts: mutations.addMembers.isPending,
    isRemovingContact: mutations.removeMember.isPending,
    isDeleting: mutations.remove.isPending,
    isDeleteModalOpen,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    memberPendingDeletion,
    requestContactDeletion: (member: ContactGroupMember) => setMemberPendingDeletion(member),
    closeContactDeletion: () => setMemberPendingDeletion(null),
    deleteContact,
    saveName: (name: string) =>
      mutations.update.mutateAsync({ groupId, name }).then(() => undefined),
    addContacts: (emails: string[]) =>
      mutations.addMembers.mutateAsync({ groupId, emails }).then(() => undefined),
    deleteGroup,
  };
}
