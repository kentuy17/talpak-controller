import axios from 'axios';

const DEFAULT_TIMEOUT = 10000;

const resolveApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (envBaseUrl) {
    return envBaseUrl.replace(/\/+$/, '');
  }

  return window.location.origin;
};

export const API_BASE_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};
