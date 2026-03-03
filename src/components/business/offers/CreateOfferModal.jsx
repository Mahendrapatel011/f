import React, { useState, useEffect } from 'react';
import { IoCloseOutline, IoCloudUploadOutline } from 'react-icons/io5';

const CreateOfferModal = ({ isOpen, onClose, onSave, tests = [], initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        applicableTests: [],
        isAllTests: false,
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        eligibility: {
            firstTimeOnly: false,
            minOrderValue: ''
        },
        offerCode: ''
    });
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                applicableTests: initialData.applicableTests?.map(t => t._id || t) || [],
                isAllTests: initialData.isAllTests || false,
                discountType: initialData.discountType || 'percentage',
                discountValue: initialData.discountValue || '',
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
                eligibility: {
                    firstTimeOnly: initialData.eligibility?.firstTimeOnly || false,
                    minOrderValue: initialData.eligibility?.minOrderValue || ''
                },
                offerCode: initialData.offerCode || ''
            });
            if (initialData.bannerImage) {
                setBannerPreview(initialData.bannerImage.startsWith('http') ? initialData.bannerImage : `http://localhost:5000${initialData.bannerImage}`);
            }
        } else {
            setFormData({
                title: '',
                applicableTests: [],
                isAllTests: false,
                discountType: 'percentage',
                discountValue: '',
                startDate: '',
                endDate: '',
                eligibility: {
                    firstTimeOnly: false,
                    minOrderValue: ''
                },
                offerCode: ''
            });
            setBannerFile(null);
            setBannerPreview(null);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleTestToggle = (testId) => {
        setFormData(prev => {
            const newTests = prev.applicableTests.includes(testId)
                ? prev.applicableTests.filter(id => id !== testId)
                : [...prev.applicableTests, testId];
            return { ...prev, applicableTests: newTests };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setBannerPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'applicableTests') {
                    formData[key].forEach(id => data.append('applicableTests[]', id));
                } else if (key === 'eligibility') {
                    data.append('eligibility', JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });
            if (bannerFile) {
                data.append('bannerImage', bannerFile);
            }
            await onSave(data);
            onClose();
        } catch (error) {
            console.error('Error saving offer:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Edit Offer' : 'Create New Offer'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                    {/* Offer Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Offer Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Summer Health Festival"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                        />
                    </div>

                    {/* Applicable Tests */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-gray-700">
                                Applicable Test/Package <span className="text-red-500">*</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isAllTests"
                                    checked={formData.isAllTests}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#1a237e] rounded focus:ring-[#1a237e]"
                                />
                                <span className="text-xs text-gray-600 font-medium">Apply to All Tests</span>
                            </label>
                        </div>
                        {!formData.isAllTests && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                                {tests.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-2">No tests available. Add tests to listing first.</p>
                                ) : (
                                    tests.map(test => (
                                        <label key={test._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={formData.applicableTests.includes(test._id)}
                                                onChange={() => handleTestToggle(test._id)}
                                                className="w-4 h-4 text-[#1a237e] rounded focus:ring-[#1a237e]"
                                            />
                                            <span className="text-sm text-gray-700">{test.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Discount Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                            >
                                <option value="percentage">Percentage % OFF</option>
                                <option value="flat">Flat Amount ₹ OFF</option>
                            </select>
                        </div>
                        {/* Discount Value */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Discount Value <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Start Date & Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] text-sm"
                            />
                        </div>
                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                End Date & Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] text-sm"
                            />
                        </div>
                    </div>

                    {/* Eligibility */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">Eligibility (Optional)</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="eligibility.firstTimeOnly"
                                    checked={formData.eligibility.firstTimeOnly}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-[#1a237e] rounded focus:ring-[#1a237e]"
                                />
                                <span className="text-sm text-gray-600">First Time Customer Only</span>
                            </label>
                            <div className="flex items-center gap-3 mt-1">
                                <label className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.eligibility.minOrderValue}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            eligibility: { ...prev.eligibility, minOrderValue: prev.eligibility.minOrderValue ? '' : '500' }
                                        }))}
                                        className="w-4 h-4 text-[#1a237e] rounded focus:ring-[#1a237e]"
                                    />
                                    <span className="text-sm text-gray-600">Minimum Order Value</span>
                                </label>
                                {!!formData.eligibility.minOrderValue !== false && (
                                    <input
                                        type="number"
                                        name="eligibility.minOrderValue"
                                        value={formData.eligibility.minOrderValue}
                                        onChange={handleChange}
                                        placeholder="₹2,000"
                                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-xs"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Offer Code */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Offer Code (Optional)
                        </label>
                        <input
                            type="text"
                            name="offerCode"
                            value={formData.offerCode}
                            onChange={handleChange}
                            placeholder="e.g., HEALTH20"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] placeholder:uppercase font-medium"
                        />
                    </div>

                    {/* Banner Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Banner Image (Optional)
                        </label>
                        <div className="relative group">
                            <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#1a237e]/50">
                                {bannerPreview ? (
                                    <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                            <IoCloudUploadOutline className="text-2xl text-gray-400" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">Click to upload or Drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPEG, JPG up to 2MB</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            {bannerPreview && (
                                <button
                                    type="button"
                                    onClick={() => { setBannerFile(null); setBannerPreview(null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <IoCloseOutline className="text-xl" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#1a237e] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#1a237e]/20 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : initialData ? 'Update Offer' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOfferModal;
