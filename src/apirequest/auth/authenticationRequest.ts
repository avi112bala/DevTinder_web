import { apiService } from '../../api/apiservices';

export interface LoginPayload {
  emailId: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  photoUrl?: string;
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  about?: string;
  photoUrl?: string;
  age?: string;
  gender?: string;
  userId?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginApi = (payload: LoginPayload) =>
  apiService.post({ url: '/login', payload });

export const signupApi = (payload: SignupPayload) =>
  apiService.post({ url: '/signup', payload });

/** Calls the backend POST /logout endpoint to clear the session cookie */
export const logoutApi = () =>
  apiService.post({ url: '/logout', payload: {} });

// ── Profile ───────────────────────────────────────────────────────────────────

export const fetchProfileApi = () => apiService.get('/profile');

export const updateProfileApi = (payload: ProfileUpdatePayload) =>
  apiService.patch({ url: '/profile/edit', payload });

// ── Feed ──────────────────────────────────────────────────────────────────────

export const fetchFeedApi = () => apiService.get('/feed');

export const sendConnectionRequestApi = (status: string, userId: string) =>
  apiService.post({ url: `/request/send/${status}/${userId}`, payload: {} });

// ── Connections ───────────────────────────────────────────────────────────────

export const fetchConnectionsApi = () => apiService.get('/user/connection');

// ── Received Requests ─────────────────────────────────────────────────────────

export const fetchReceivedRequestsApi = () =>
  apiService.get('/users/request/received');

export const reviewConnectionRequestApi = (status: string, requestId: string) =>
  apiService.post({ url: `/request/review/${status}/${requestId}`, payload: {} });
