import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';
import { notificationController } from '@app/controllers/notificationController';
//import { useHistory } from 'react-router-dom';

export const httpApi = axios.create({
  baseURL: 'http://192.168.143.13:8000',
  // withCredentials: true
});

const token = window.localStorage.getItem('accessToken') || 'bearerToken';

// const history = useHistory()
if (!token) {
  setTimeout(() => {
    notificationController.warning({ message: "You have to login or signup" })
    // history.push('/auth/login')
  }, 0)
}

httpApi.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${readToken()}` };

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
