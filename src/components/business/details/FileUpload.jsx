// components/business/details/FileUpload.jsx
import React, { useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaFileAlt } from 'react-icons/fa';

const FileUpload = ({
    label,
    value,
    onChange,
    required = false,
    accept = '.pdf,.jpg,.jpeg,.png',
    className = '',
    existingUrl = null
}) => {
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const getFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:5000/${url.replace(/\\/g, '/')}`;
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex justify-between items-center">
                <span>
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </span>
                {existingUrl && !value && (
                    <a
                        href={getFileUrl(existingUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FaFileAlt className="w-3 h-3" /> View Uploaded
                    </a>
                )}
            </label>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            <div
                onClick={handleClick}
                className={`w-full px-3 py-3 border border-dashed rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer
                    ${value ? 'border-blue-400 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
            >
                {value ? (
                    <div className="flex items-center gap-2 text-gray-700 w-full justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FaFileAlt className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate">{value.name}</span>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors shrink-0"
                        >
                            <FaTimes className="w-3 h-3 text-red-500" />
                        </button>
                    </div>
                ) : (
                    <>
                        <FaCloudUploadAlt className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">
                            {existingUrl ? 'Click to replace file' : 'Choose a file or drag & drop'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;