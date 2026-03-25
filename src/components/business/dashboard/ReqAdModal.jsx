import React, { useState } from 'react';
import axios from 'axios';
import { FaImage, FaMapMarkerAlt, FaBullhorn } from 'react-icons/fa';
import Modal from '../../common/Modal';
import FormField from '../../common/FormField';
import Input from '../../common/Input';
import Button from '../../common/Button';

const ReqAdModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [pincodes, setPincodes] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('businessToken');
            const formData = new FormData();
            formData.append('title', title);

            if (pincodes) {
                // Split by comma and clean
                const cleaned = pincodes.split(',').map(p => p.trim()).filter(p => p);
                formData.append('pincodes', JSON.stringify(cleaned));
            }

            if (imageFile) {
                formData.append('image', imageFile);
            } else {
                setMessage({ type: 'error', text: 'Please upload an advertisement image.' });
                setLoading(false);
                return;
            }

            const res = await axios.post('http://localhost:5000/api/business/banners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Advertisement requested successfully! Waiting for admin approval.' });
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                    // Reset Form
                    setTitle('');
                    setPincodes('');
                    setImageFile(null);
                }, 2000);
            }
        } catch (error) {
            console.error('Error requesting ad:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit request.' });
        } finally {
            setLoading(false);
        }
    };

    const modalTitle = (
        <span className="flex items-center gap-2">
            <FaBullhorn className="text-[#1e3a5f]" />
            Request Advertisement
        </span>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
        >
            <div className="pt-2">
                {message && (
                    <div className={`mb-4 px-4 py-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <FormField label="Advertisement Title" required>
                        <Input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="E.g. Get 20% off on all tests"
                        />
                    </FormField>

                    {/* Image */}
                    <FormField label={<span className="flex items-center gap-2"><FaImage className="text-gray-500" /> Upload Poster / Banner</span>} required>
                        <input
                            type="file"
                            required
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                        />
                    </FormField>

                    {/* Pincodes */}
                    <FormField label={<span className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> Target Pincodes</span>}>
                        <Input
                            type="text"
                            value={pincodes}
                            onChange={(e) => setPincodes(e.target.value)}
                            placeholder="E.g. 452001, 452010"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate with commas. Leave blank to show everywhere.</p>
                    </FormField>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-[rgb(30,58,95)] border border-blue-100">
                        <div>
                            <p className="font-semibold mb-1">Information:</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs">
                                <li>After submission, your ad will be sent to the admin for approval.</li>
                                <li>Once payment integration is complete in the future, you will pay exactly for targeted locations.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 mt-2 flex justify-end gap-3">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="secondary" size="sm" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ReqAdModal;
