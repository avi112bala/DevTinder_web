import { apiService } from "../api/apiservices";

export const paymentcreate = async (data: any) => {
    const response = await apiService.post({ url: `/api/playlist/campaigns/create`, payload: data });
    return response
}

export const logout = () => {
  try {
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
