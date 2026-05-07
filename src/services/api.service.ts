import axios from 'axios';
import { UserData } from './mockService';



/**
 * TAG-CASE#5: Axios Instance Configuration
 * This is the primary gateway to your Spring Boot v1 Backend.
 */
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiAcceptDoc = axios.create({
  baseURL: baseURL,
  responseType: 'blob', // CRITICAL: This prevents Axios from parsing binary as text
  // Optional: Ensure headers are set for binary
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/octet-stream'
  },
});

const apiAttachdDoc = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * TAG-CASE#1: Document Data Interface
 * Production-grade strict typing for the Document Lifecycle.
 */
export interface DocumentData {
  id: number;
  fileName: string;
  status: 'CREATED' | 'INITIATED' | 'PROGRESS' | 'REVIEW' | 'APPROVED' | 'COMPLETED' | 'PUBLISHED' | 'DELETED' | string; // Allow for future statuses
  htmlContent: string; 
  lastModified?: string;
}

/** * USER MANAGEMENT SERVICES 
 */
export const getUsers = async (params: { page: number; size: number; sort?: string; search?: string; }) => {
  const response = await api.get('/users', { params });
  return response.data; 
};

export const getUserById = async (id: number) => {
  return await api.get<UserData>(`/users/${id}`);
};

export const createUser = async (userData: Partial<UserData>) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * DOCUMENT MANAGEMENT SERVICES (TASK#290426A1157)
 */
export const documentService = {
  
  // IMPORTANT: Update fetchDocuments to point to the new /all DB endpoint

  /**
   * 1. LIST: Fetch metadata for the DataTable
   * INTEGRATION: Maps to @GetMapping("/documents")
   */
  fetchDocuments: async (): Promise<DocumentData[]> => {
    try {
      // Integration: 
      const response = await api.get<DocumentData[]>('/docs/data'); //docs/all
      return response.data;

      // Mock Data adjusted for Lifecycle Testing
      /*
      return [
        { 
          id: 1, 
          fileName: 'Technical-Spec-Alpha.docx', 
          status: 'PROGRESS', 
          htmlContent: '<h2>Technical Specification</h2><p>Initial draft for Alpha project.</p>',
          lastModified: new Date().toISOString() 
        },
        { 
          id: 2, 
          fileName: 'Product-Manual-v1.docx', 
          status: 'CREATED', 
          htmlContent: '', 
          lastModified: new Date().toISOString() 
        },
        { 
          id: 3, 
          fileName: 'Product-Catalog-2026.docx', 
          status: 'PUBLISHED', 
          htmlContent: '<h1>Catalog 2026</h1><p>Finalized and locked content.</p>',
          lastModified: new Date().toISOString() 
        },
         { 
          id: 4, 
          fileName: 'Tax-Collections-v1.docx', 
          status: 'REVIEW', 
          htmlContent: '<h1>Tax Collections 2026</h1><p>Intial content.</p>',
          lastModified: new Date().toISOString() 
        },
         { 
          id: 5, 
          fileName: 'Product-Management-v1.docx', 
          status: 'APPROVED', 
          htmlContent: '<h1>Product Management 2026</h1><p>Finalized and locked content.</p>',
          lastModified: new Date().toISOString() 
        },
       
      ]; */

    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  },

  /**
   * 1. LIST: Fetch Mock metadata for the DataTable
   */
  fetchMockDocuments: async (): Promise<DocumentData[]> => {
    try {
        // Mock Data adjusted for Lifecycle Testing
      return [
        { 
          id: 1, 
          fileName: 'Technical-Spec-Alpha.docx', 
          status: 'PROGRESS', 
          htmlContent: '<h2>Technical Specification</h2><p>Initial draft for Alpha project.</p>',
          lastModified: new Date().toISOString() 
        },
        { 
          id: 2, 
          fileName: 'Product-Manual-v1.docx', 
          status: 'CREATED', 
          htmlContent: '', 
          lastModified: new Date().toISOString() 
        },
        { 
          id: 3, 
          fileName: 'Product-Catalog-2026.docx', 
          status: 'PUBLISHED', 
          htmlContent: '<h1>Catalog 2026</h1><p>Finalized and locked content.</p>',
          lastModified: new Date().toISOString() 
        },
         { 
          id: 4, 
          fileName: 'Tax-Collections-v1.docx', 
          status: 'REVIEW', 
          htmlContent: '<h1>Tax Collections 2026</h1><p>Intial content.</p>',
          lastModified: new Date().toISOString() 
        },
         { 
          id: 5, 
          fileName: 'Product-Management-v1.docx', 
          status: 'APPROVED', 
          htmlContent: '<h1>Product Management 2026</h1><p>Finalized and locked content.</p>',
          lastModified: new Date().toISOString() 
        },
       
      ]; 

    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  },

  createNewDocument: async (payload: { fileName: string, status: string, htmlContent: string }) => {
    const response = await api.post(`/docs/create`, payload);
    return response.data;
},

softDelete: async (id: number): Promise<void> => {
    try {
      await api.post(`/docs/${id}/delete`);
    } catch (error: any) {
      throw new Error(error.response?.data || "Failed to delete document.");
    }
  },

  /**
   * 2. SAVE CONTENT: Updates HTML and Status
   * INTEGRATION: @PutMapping("/documents/{id}/content")
   * Matches TASK#290426A1157.3
   */
  saveHtmlContent: async (id: number, html: string, status: string): Promise<void> => {
    const response = await api.put(`/docs/${id}/content`, {
      html: html,
      status: status 
    });

    if (response.status !== 200) {
      throw new Error('Failed to update document content');
    }
  },

  /**
   * 3. EXPORT HTML: Retrieve stored HTML for a specific filename
   */
  fetchDocumentAsHtml: async (filename: string): Promise<string> => {
    const response = await api.get(`/docs/export-html/${filename}`);
    return response.data.html;
  },

  /**
   * 4. IMPORT HTML: Convert HTML back to .docx and save
   */
  saveHtmlAsDocx: async (html: string, filename: string): Promise<any> => {
    return await api.post(`/docs/import-html`, {
      html: html,
      filename: filename
    });
  },

  /**
   * 5. BINARY DOWNLOAD: Get .docx file for external editing
   * Matches TASK#290426A1157.4
   */
  /* 
  fetchDocumentContent: async (filename: string): Promise<Blob> => {
    const response = await api.get(`/docs/download/${filename}`, { 
      responseType: 'blob' 
    });
    return response.data;
  },
  */
async fetchDocumentContent(filename: string): Promise<Blob> {
    const response = await apiAcceptDoc.get(`/docs/download/${filename}`);
    return response.data;
},


  /**
   * 6. BINARY UPLOAD: Upload .docx file after external editing
   * Matches TASK#290426A1157.4
   */
    saveDocument: async (file: Blob, filename: string): Promise<any> => {
    const formData = new FormData();
    // Parameter 1: matches @RequestParam("file")
    formData.append('file', file); 
    // Parameter 2: matches @RequestParam("filename")
    formData.append('filename', filename); 

    const response = await apiAttachdDoc.post(`docs/save`, formData);
    return response.data;
},

  /**
   * 7. DELETE: Remove document
   */
  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  /**
   * ALIAS: For frontend component compatibility
   */
  updateDocumentContent: async (id: number, html: string, status: string): Promise<void> => {
    return documentService.saveHtmlContent(id, html, status);
  },
  /**
   * TASK#050526P1239.4: Manual Upload with Version Control
   * Sends a raw .docx file to be replaced in the production directory 
   * while triggering the backend's history archival logic.
   */
  manualUpload: async (file: File, filename: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    try {
      const response = await apiAttachdDoc.post(`/docs/manual-upload`, formData);
      return response.data;
    } catch (error: any) {
      console.error("Manual upload failed:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Failed to synchronize manual version.");
    }
  },
};

export default api;