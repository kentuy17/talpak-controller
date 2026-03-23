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

/**
 * Function to get the value of a cookie by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The value of the cookie if found, otherwise null
 */
// Helper function to get cookie value
export const getCookie = (name) => {
  // Create a string with all cookies, prefixed with '; ' to ensure proper splitting
  const value = `; ${document.cookie}`;
  // Split the string to find the cookie with the specified name
  const parts = value.split(`; ${name}=`);
  // If the cookie exists, extract and return its value
  if (parts.length === 2) return parts.pop().split(';').shift();
  // Return null if the cookie is not found
  return null;
};
