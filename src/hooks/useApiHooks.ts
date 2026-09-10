import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { addUser, removeUser } from '../utils/userSlice';
import { addfeed, removeFeed, removeprevFeed } from '../utils/feedSlice';
import { addConnection } from '../utils/connectionSlice';
import { addRequest, removeRequest } from '../utils/requestSlice';
import Cookies from "js-cookie"
import {
  loginApi,
  signupApi,
  logoutApi,
  fetchProfileApi,
  updateProfileApi,
  fetchFeedApi,
  sendConnectionRequestApi,
  fetchConnectionsApi,
  fetchReceivedRequestsApi,
  reviewConnectionRequestApi,
  type LoginPayload,
  type SignupPayload,
  type ProfileUpdatePayload,
} from '../apirequest/auth/authenticationRequest';
import { toast } from 'sonner';

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  profile: ['profile'] as const,
  feed: ['feed'] as const,
  connections: ['connections'] as const,
  receivedRequests: ['receivedRequests'] as const,
};

// ── Auth Hooks ─────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data: any) => {
      queryClient.clear();
      dispatch(addUser(data?.data ?? data?.data?.userWithoutPassword));
      const token = data?.data?.token
      if (token) {
        Cookies.set('token', token, {
          expires: 1,
          secure: true,
          sameSite: 'strict',
        });
      }
      navigate('/');
    },
    // Do NOT navigate on error – the form stays visible and shows the toast
    // from the apiService interceptor
  });
};

export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignupPayload) => signupApi(payload),
    onSuccess: (data: any) => {
      queryClient.clear();
      dispatch(addUser(data?.data ?? data));
      navigate('/profile');
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      // Run cleanup regardless of success/failure
      dispatch(removeUser());
      dispatch(removeFeed());
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    },
  });
};

// ── Profile Hooks ──────────────────────────────────────────────────────────────

/** Used on the /profile page – redirects on 401 via useEffect */
export const useProfile = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const query = useQuery<any>({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => fetchProfileApi(),
    retry: false,
    select: (data: any) => data?.data ?? data,
    enabled: !!token
  });

  // Redirect to login only when the query definitively errors with 401
  useEffect(() => {
    if (query.isError && (query.error as any)?.response?.status === 401) {
      navigate('/login');
    }
  }, [query.isError, query.error, navigate]);

  return query;
};

/** Used in NavBar – shares the same cache key as useProfile */
export const useNavProfile = () => {
  const dispatch = useDispatch();
  const token = Cookies.get('token');

  const query = useQuery<any>({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => fetchProfileApi(),
    retry: false,
    select: (data: any) => data?.data ?? data,
    enabled:!!token
  });

  // Sync fetched user into Redux so NavBar and other consumers stay in sync
  useEffect(() => {
    if (query.data) {
      dispatch(addUser(query.data));
    }
  }, [query.data, dispatch]);

  return query;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfileApi(payload),
    onSuccess: (data: any) => {
      toast.success(data?.message ?? 'Profile updated successfully!', {
        position: 'top-right',
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(msg, { position: 'top-right' });
    },
  });
};

// ── Feed Hooks ─────────────────────────────────────────────────────────────────

export const useFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const query = useQuery<any[]>({
    queryKey: QUERY_KEYS.feed,
    queryFn: async () => {
      const res = await fetchFeedApi() as any;
      const feedItems = res?.user ?? res?.data ?? res ?? [];
      dispatch(addfeed(feedItems));
      return feedItems;
    },
    retry: false,
    enabled:!!token
  });

  // Redirect on 401 via effect (not during render)
  useEffect(() => {
    if (query.isError && (query.error as any)?.response?.status === 401) {
      navigate('/login');
    }
  }, [query.isError, query.error, navigate]);

  return query;
};

export const useSendConnectionRequest = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ status, userId }: { status: string; userId: string }) =>
      sendConnectionRequestApi(status, userId),
    onSuccess: (_data: any, variables: { status: string; userId: string }) => {
      dispatch(removeprevFeed(variables.userId));
    },
    onError: (error: any) => {
      console.error('Connection request failed:', error);
    },
  });
};

// ── Connections Hooks ──────────────────────────────────────────────────────────

export const useConnections = () => {
  const dispatch = useDispatch();

  return useQuery<any[]>({
    queryKey: QUERY_KEYS.connections,
    queryFn: async () => {
      const res = await fetchConnectionsApi() as any;
      const connections = res?.data ?? res ?? [];
      dispatch(addConnection(connections));
      return connections;
    },
    retry: false,
  });
};

// ── Received Requests Hooks ────────────────────────────────────────────────────

export const useReceivedRequests = () => {
  const dispatch = useDispatch();

  return useQuery<any[]>({
    queryKey: QUERY_KEYS.receivedRequests,
    queryFn: async () => {
      const res = await fetchReceivedRequestsApi() as any;
      const requests = res?.data ?? res ?? [];
      dispatch(addRequest(requests));
      return requests;
    },
    retry: false,
  });
};

export const useReviewConnectionRequest = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, requestId }: { status: string; requestId: string }) =>
      reviewConnectionRequestApi(status, requestId),
    onSuccess: (_data: any, variables: { status: string; requestId: string }) => {
      dispatch(removeRequest(variables.requestId));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.receivedRequests });
    },
    onError: (error: any) => {
      console.error('Review request failed:', error);
    },
  });
};
