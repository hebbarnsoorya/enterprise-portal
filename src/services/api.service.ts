import axios from 'axios';
import { UserData } from './mockService';

const API_DOCS_BASE_URL = 'http://localhost:8080/api/docs';
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

export const getUserById = async (id: number) => {
  const response = await api.get<UserData>(`/users/${id}`);
  return response;
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



/**
 * TAG-CASE#1: Document Data Interface
 */
export interface DocumentData {
  id: number;
  fileName: string;
  status: string;
  lastModified: string;
}

export const documentService = {
  /**
   * 1. LIST: Fetch metadata for the DataTable
   * Maps to your Spring Boot list endpoint
   */
  fetchDocuments: async (): Promise<DocumentData[]> => {
    try {
      //const response = await axios.get<DocumentData[]>(`${API_DOCS_BASE_URL}/list`);
      //return response.data;
      return [
        { id: 1, fileName: 'auditing.docx', status: 'TAG-CASE#1', lastModified: new Date().toISOString() },
        { id: 2, fileName: 'productmanagement.docx', status: 'Pending', lastModified: new Date().toISOString() },
        { id: 3, fileName: 'taxcollections.docx', status: 'Draft', lastModified: new Date().toISOString() },
      ];
    } catch (error) {
      console.error("Error fetching document list:", error);
      // NOTE#280426P0129: Fallback to mock data if API is unreachable
      return [
        { id: 1, fileName: 'auditing.docx', status: 'TAG-CASE#1', lastModified: new Date().toISOString() },
        { id: 2, fileName: 'productmanagement.docx', status: 'Pending', lastModified: new Date().toISOString() },
        { id: 3, fileName: 'taxcollections.docx', status: 'Draft', lastModified: new Date().toISOString() },
      ];
    }
  },

  /**
   * 2. READ: Streams binary content from the server
   * INTEGRATION: @GetMapping("/{filename:.+}")
   * Critical: Uses responseType 'blob' to handle ResponseEntity<Resource>
   */
  fetchDocumentContent: async (filename: string): Promise<Blob> => {
    try {
      const response = await axios.get(`${API_DOCS_BASE_URL}/${filename}`, {
        responseType: 'blob', 
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error reading file: ${filename}`, error);
      throw error;
    }
  },

  /**
   * 3. SAVE: Uploads/Updates the file on the server
   * INTEGRATION: @PostMapping("/save")
   * Uses FormData for MultipartFile compatibility
   */
  saveDocument: async (file: Blob, filename: string): Promise<any> => {
    const formData = new FormData();
    // Ensure 'file' key matches the @RequestParam("file") in Spring Boot
    formData.append('file', file, filename);
    formData.append('filename', filename);

    try {
      const response = await axios.post(`${API_DOCS_BASE_URL}/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error saving file: ${filename}`, error);
      throw error;
    }
  },

  /**
   * 4. DELETE: Removes file from storage
   * INTEGRATION: @DeleteMapping("/{filename:.+}")
   */
  deleteDocument: async (filename: string): Promise<void> => {
    try {
      await axios.delete(`${API_DOCS_BASE_URL}/${filename}`);
    } catch (error) {
      console.error(`Error deleting file: ${filename}`, error);
      throw error;
    }
  }
};


// Exporting the instance as default in case other services need it
export default api;