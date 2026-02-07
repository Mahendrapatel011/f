// components/support/RaiseTicketModal.jsx
import { useState, useRef } from 'react';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import Button from '../common/Button';

const RaiseTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        attachments: []
    });
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // File handling
    const handleFiles = (files) => {
        const newFiles = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...newFiles]
        }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit?.(formData);
            handleDiscard();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        setFormData({ subject: '', description: '', attachments: [] });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">Raise a Ticket</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400 text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Your problem"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                text-gray-700 placeholder-gray-400
                                focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]
                                transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe your problem"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                text-gray-700 placeholder-gray-400 resize-none
                                focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]
                                transition-colors"
                        />
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Attachment
                        </label>

                        {/* Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                                transition-colors
                                ${dragActive
                                    ? 'border-[#1e3a5f] bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }
                            `}
                        >
                            <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                                Drag file to attach or{' '}
                                <span className="text-[#1e3a5f] font-medium">browse</span>
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                        />

                        {/* Preview Files */}
                        {formData.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.attachments.map((attachment, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={attachment.preview}
                                            alt={attachment.name}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-[#E11D48] text-white 
                                                rounded-full text-xs flex items-center justify-center
                                                opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleDiscard}
                            className="flex-1 !border-gray-300 !text-gray-600 hover:!bg-gray-50"
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            size="md"
                            disabled={loading || !formData.subject || !formData.description}
                            className="flex-1"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RaiseTicketModal;