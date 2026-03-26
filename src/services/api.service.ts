import axios from 'axios';
import { UserData } from './mockService';

/**
 * TAG-CASE#5: Axios Instance Configuration
 * We centralize the base URL and headers here to avoid repeating
 * them in every individual service call.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * TAG-CASE#5: Fetch Users
 * @param params Spring Boot Pageable parameters
 * @returns Spring Boot Page object: { content: [], totalElements: 100, ... }
 */
export const getUsers = async (params: {
  page: number;
  size: number;
  sort?: string; // Format: "column,asc" or "column,desc"
  search?: string;
}) => {
  // Use the 'api' instance instead of 'axios' directly
  const response = await api.get('/users', { params });
  return response.data; 
};

/**
 * TAG-CASE#5: Create a new user in the DB
 * This sends a POST request to the Spring Boot /users endpoint.
 */
export const createUser = async (userData: Partial<UserData>) => {
  // Fixed: Now 'api' is correctly defined above
  const response = await api.post('/users', userData);
  return response.data;
};

// Exporting the instance as default in case other services need it
export default api;