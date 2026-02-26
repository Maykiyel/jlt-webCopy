import { PUT, apiClient } from "@/lib/api/client";
import type { ApiResponse, UserResource } from "@/types/api";

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  position?: string | null;
  contact_number?: string | null;
  email?: string;
}

export interface ChangePasswordRequest {
  current_password?: string | null;
  new_password: string;
  new_password_confirmation: string;
}

export const accountSettingsService = {
  async updateProfile(
    userId: number,
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UserResource>> {
    return PUT<ApiResponse<UserResource>>(`/users/${userId}`, data);
  },

  async changePassword(
    userId: number,
    data: ChangePasswordRequest,
  ): Promise<ApiResponse<null>> {
    return PUT<ApiResponse<null>>(`/users/${userId}/change-password`, data);
  },

  async uploadAvatar(userId: number, file: File): Promise<ApiResponse<null>> {
    const form = new FormData();
    form.append("image", file);
    const response = await apiClient.post<ApiResponse<null>>(
      `/users/${userId}/change-profile`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
