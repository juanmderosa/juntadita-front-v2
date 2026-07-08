import { http } from "@/api/http";
import type { SuccessResponse } from "@/types/api";
import type { CurrentUser } from "@/types/users";
import { currentUserResponseSchema } from "@/schemas/users.schemas";

export const usersApi = {
  async getCurrentUser(accessToken: string) {
    const response = await http.get<SuccessResponse<CurrentUser>>("/api/v1/me", {
      accessToken,
      responseSchema: currentUserResponseSchema,
    });

    return response.data;
  },

  async updateCurrentUserProfile(accessToken: string, displayName: string) {
    const response = await http.patch<SuccessResponse<CurrentUser>>(
      "/api/v1/me/profile",
      { displayName },
      { accessToken, responseSchema: currentUserResponseSchema },
    );

    return response.data;
  },
};
