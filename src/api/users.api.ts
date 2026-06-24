import { http } from "./http";
import type { SuccessResponse } from "../types/api";
import type { CurrentUser } from "../types/users";

export const usersApi = {
  async getCurrentUser(accessToken: string) {
    const response = await http.get<SuccessResponse<CurrentUser>>("/api/v1/me", {
      accessToken,
    });

    return response.data;
  },

  async updateCurrentUserProfile(accessToken: string, displayName: string) {
    const response = await http.patch<SuccessResponse<CurrentUser>>(
      "/api/v1/me/profile",
      { displayName },
      { accessToken },
    );

    return response.data;
  },
};
