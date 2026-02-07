// components/business/navbar/UpdateProfileModal.jsx
import { useState, useRef } from 'react';
import axios from 'axios';
import { FaUser, FaCamera, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UpdateProfileModal = ({ isOpen, onClose, currentImage, onUpdate }) => {
    const [preview, setPreview] = useState(currentImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            setSelectedFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            toast.error('Please select a new image');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        try {
            const token = localStorage.getItem('businessToken');
            const response = await axios.put(
                'http://localhost:5000/api/business/auth/profile-image',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Profile picture updated!');
                // Wait a bit to show success before closing
                // Construct the full URL if meaningful or use what backend returned
                // If path is local e.g. "uploads\...", we need to prefix
                let newImagePath = response.data.data.profileImage;

                onUpdate(newImagePath);
                onClose();
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile picture');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Helper to render image source safely
    const getImageSrc = (src) => {
        if (!src) return null;
        if (src.startsWith('data:') || src.startsWith('http')) return src;
        // Ensure static serving path
        return `http://localhost:5000/${src.replace(/\\/g, '/')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Update Profile Picture</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    {/* Image Preview */}
                    <div className="relative mb-6 group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner bg-gray-50 flex items-center justify-center">
                            {preview ? (
                                <img
                                    src={getImageSrc(preview)}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <FaUser className="w-12 h-12 text-blue-300" />
                            )}
                        </div>
                        {/* Overlay to hint click */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 cursor-pointer transition-colors flex items-center justify-center"
                        >
                            <FaCamera className="text-white opacity-0 group-hover:opacity-100 text-2xl drop-shadow-md transform scale-50 group-hover:scale-100 transition-all duration-200" />
                        </div>
                    </div>

                    <div className="w-full text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose New Picture
                        </label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1 bg-white">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                            >
                                Choose File
                            </button>
                            <span className="text-sm text-gray-500 truncate flex-1 text-left px-2">
                                {selectedFile ? selectedFile.name : 'No file chosen'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Supported formats: JPEG, PNG, JPG (Max 5MB)
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading || !selectedFile}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <FaSpinner className="animate-spin" />}
                        Save Picture
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
