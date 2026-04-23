import React, { useState, useEffect, useRef } from 'react';
import fileService from '../../services/fileService';
import toast from 'react-hot-toast';

const CourseMaterials = ({ courseId }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, [courseId]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await fileService.getCourseFiles(courseId);
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            // toast.error('Failed to load course materials');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preliminary size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File is too large. Maximum size is 10MB.');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            await fileService.uploadFile(courseId, file, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });
            
            toast.success('File uploaded successfully!');
            fetchFiles(); // Refresh list
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to upload file';
            toast.error(errorMsg);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            await fileService.deleteFile(fileId);
            toast.success('File deleted');
            setFiles(files.filter(f => f.id !== fileId));
        } catch (error) {
            toast.error('Failed to delete file');
        }
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return (
            <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
            </svg>
        );
        if (type.includes('image')) return (
            <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        );
        if (type.includes('word') || type.includes('doc')) return (
            <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
        );
        return (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z"/>
            </svg>
        );
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                        Course Materials
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Upload and manage study resources, notes, and references.
                    </p>
                </div>

                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        id="course-file-upload"
                        disabled={uploading}
                    />
                    <label
                        htmlFor="course-file-upload"
                        className={`inline-flex items-center px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 ${
                            uploading 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-gray-900 shadow-indigo-200 dark:shadow-none'
                        }`}
                    >
                        {uploading ? (
                            <div className="flex items-center gap-3">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{uploadProgress}%</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Upload Material</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-20 bg-gray-50 dark:bg-slate-900/50 animate-pulse rounded-2xl"></div>
                    ))}
                </div>
            ) : files.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="group flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="flex-shrink-0">
                                    {getFileIcon(file.file_type)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                                        {file.original_name}
                                    </h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={fileService.getFileUrl(file.file_path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                    title="View/Download"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                                    title="Delete Material"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 border-2 border-dashed border-gray-100 dark:border-slate-700 rounded-[2rem] text-center">
                    <p className="text-gray-400 font-medium">No materials uploaded for this course yet.</p>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;
