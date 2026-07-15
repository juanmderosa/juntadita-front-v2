import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "@/api/groups.api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const groupsQueryKey = ["groups"] as const;
export const groupQueryKey = (groupId: string) => ["groups", groupId] as const;

export function useGroups() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: groupsQueryKey,
    enabled: Boolean(accessToken),
    queryFn: () => groupsApi.list(accessToken!),
  });
}

export function useGroup(groupId: string | null) {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: groupQueryKey(groupId ?? ""),
    enabled: Boolean(accessToken && groupId),
    queryFn: () => groupsApi.getById(accessToken!, groupId!),
  });
}

export function useGroupMutations() {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  const refresh = async (groupId?: string) => {
    await client.invalidateQueries({ queryKey: groupsQueryKey });
    if (groupId)
      await client.invalidateQueries({ queryKey: groupQueryKey(groupId) });
  };
  return {
    create: useMutation({
      mutationFn: (name: string) => groupsApi.create(accessToken!, name),
      onSuccess: (group) => refresh(group.id),
    }),
    update: useMutation({
      mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
        groupsApi.update(accessToken!, groupId, name),
      onSuccess: (group) => refresh(group.id),
    }),
    remove: useMutation({
      mutationFn: (groupId: string) => groupsApi.delete(accessToken!, groupId),
      onSuccess: () => refresh(),
    }),
    addMembers: useMutation({
      mutationFn: ({
        groupId,
        emails,
      }: {
        groupId: string;
        emails: string[];
      }) => groupsApi.addMembers(accessToken!, groupId, emails),
      onSuccess: (group) => refresh(group.id),
    }),
    removeMember: useMutation({
      mutationFn: ({
        groupId,
        memberId,
      }: {
        groupId: string;
        memberId: string;
      }) => groupsApi.deleteMember(accessToken!, groupId, memberId),
      onSuccess: (_result, input) => refresh(input.groupId),
    }),
  };
}
