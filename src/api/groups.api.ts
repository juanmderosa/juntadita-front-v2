import { http } from "@/api/http";
import {
  groupResponseSchema,
  groupsResponseSchema,
} from "@/features/groups/schemas/groups.schemas";
import type { SuccessResponse } from "@/types/api";
import type { ContactGroup, ContactGroupDetail } from "@/types/groups";

export const groupsApi = {
  async list(accessToken: string) {
    const response = await http.get<SuccessResponse<ContactGroup[]>>(
      "/api/v1/groups",
      {
        accessToken,
        responseSchema: groupsResponseSchema,
      },
    );
    return response.data;
  },
  async getById(accessToken: string, groupId: string) {
    const response = await http.get<SuccessResponse<ContactGroupDetail>>(
      `/api/v1/groups/${encodeURIComponent(groupId)}`,
      { accessToken, responseSchema: groupResponseSchema },
    );
    return response.data;
  },
  async create(accessToken: string, name: string) {
    const response = await http.post<SuccessResponse<ContactGroupDetail>>(
      "/api/v1/groups",
      { name },
      { accessToken, responseSchema: groupResponseSchema },
    );
    return response.data;
  },
  async update(accessToken: string, groupId: string, name: string) {
    const response = await http.patch<SuccessResponse<ContactGroupDetail>>(
      `/api/v1/groups/${encodeURIComponent(groupId)}`,
      { name },
      { accessToken, responseSchema: groupResponseSchema },
    );
    return response.data;
  },
  async delete(accessToken: string, groupId: string) {
    await http.delete<SuccessResponse<{ deleted: true }>>(
      `/api/v1/groups/${encodeURIComponent(groupId)}`,
      { accessToken },
    );
  },
  async addMembers(accessToken: string, groupId: string, emails: string[]) {
    const response = await http.post<SuccessResponse<ContactGroupDetail>>(
      `/api/v1/groups/${encodeURIComponent(groupId)}/members`,
      { emails },
      { accessToken, responseSchema: groupResponseSchema },
    );
    return response.data;
  },
  async deleteMember(accessToken: string, groupId: string, memberId: string) {
    await http.delete<SuccessResponse<{ deleted: true }>>(
      `/api/v1/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(memberId)}`,
      { accessToken },
    );
  },
};
