import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import Button from '../common/Button';

const EditTicketModal = ({ isOpen, onClose, ticket, onUpdate }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        attachments: []
    });
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (ticket) {
            setFormData({
                subject: ticket.subject,
                description: ticket.description,
                attachments: ticket.attachments || [] // Existing attachments
            });
        }
    }, [ticket]);

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

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onUpdate(ticket._id, formData);
            onClose();
        } catch (error) {
            console.error('Error updating ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !ticket) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-full max-w-md bg-white rounded-2xl shadow-xl z-[70] max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Ticket</h3>
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
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                text-gray-700 focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                text-gray-700 resize-none focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                        />
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Attachments
                        </label>

                        {/* Drop Zone */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                                transition-colors
                                ${dragActive
                                    ? 'border-[#1e3a5f] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            <FaCloudUploadAlt className="mx-auto text-2xl text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">
                                Click or drag to add more files
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

                        {/* Preview Attachments */}
                        {formData.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.attachments.map((att, index) => {
                                    const baseUrl = 'http://localhost:5000';
                                    const preview = att.preview || (att.url ? (att.url.startsWith('http') ? att.url : `${baseUrl}${att.url}`) : null);
                                    
                                    return (
                                        <div key={index} className="relative group">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="attachment"
                                                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase">
                                                        {att.name?.split('.').pop() || 'File'}
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E11D48] text-white 
                                                    rounded-full text-[10px] flex items-center justify-center
                                                    opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={onClose}
                            className="flex-1 !border-gray-300 !text-gray-600 hover:!bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            size="md"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditTicketModal;
