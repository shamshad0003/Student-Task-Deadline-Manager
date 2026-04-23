import api from './api';

const fileService = {
    /**
     * Upload a file for a specific course
     * @param {string|number} courseId 
     * @param {File} file 
     * @param {Function} onUploadProgress - Callback for progress tracking
     */
    uploadFile: async (courseId, file, onUploadProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/files/course/${courseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return response.data;
    },

    /**
     * Get all files for a course
     */
    getCourseFiles: async (courseId) => {
        const response = await api.get(`/files/course/${courseId}`);
        return response.data;
    },

    /**
     * Delete a file
     */
    deleteFile: async (fileId) => {
        const response = await api.delete(`/files/${fileId}`);
        return response.data;
    },

    /**
     * Helper to get full URL for a file path
     */
    getFileUrl: (filePath) => {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        return `${baseUrl}${filePath}`;
    }
};

export default fileService;
