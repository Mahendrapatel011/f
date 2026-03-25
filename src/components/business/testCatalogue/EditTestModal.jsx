import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import PrescriptionEditorModal from './PrescriptionEditorModal';

const EditTestModal = ({ isOpen, onClose, onUpdate, onDelete, test, categories, subCategories = [], masterTests = [] }) => {
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        category: '',
        subCategories: [],
        price: '',
        homeCollection: false,
        isActive: true
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [filteredMasterTests, setFilteredMasterTests] = useState([]);

    useEffect(() => {
        if (test) {
            setFormData({
                name: test.name || '',
                subtitle: test.subtitle || '',
                category: test.category?._id || test.category || '',
                subCategories: test.subCategories?.map(sc => sc?._id || sc) || [],
                price: test.price || '',
                homeCollection: test.homeCollection ?? false,
                isActive: test.isActive ?? true
            });

            // Set current image preview
            if (test.images && test.images.length > 0) {
                const img = test.images[0];
                const url = img.startsWith('http') ? img : `http://localhost:5000/${img.startsWith('/') ? img.slice(1) : img}`;
                setImagePreview(url);
            } else {
                setImagePreview(null);
            }
        }
    }, [test]);

    // Filter subcategories and master tests when category changes
    useEffect(() => {
        if (formData.category) {
            const relevantSubCats = subCategories.filter(
                sub => (sub.category?._id || sub.category) === formData.category
            );
            setFilteredSubCategories(relevantSubCats);

            const relevantMasterTests = masterTests.filter(
                t => (t.category?._id || t.category) === formData.category
            );
            setFilteredMasterTests(relevantMasterTests);
        } else {
            setFilteredSubCategories([]);
            setFilteredMasterTests([]);
        }
    }, [formData.category, subCategories, masterTests]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                subCategories: [],
                name: ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubCategoryToggle = (subId) => {
        setFormData(prev => {
            const currentSubCats = prev.subCategories || [];
            if (currentSubCats.includes(subId)) {
                return { ...prev, subCategories: currentSubCats.filter(id => id !== subId) };
            } else {
                return { ...prev, subCategories: [...currentSubCats, subId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.subCategories.length === 0) {
            alert('Please select at least one sub category');
            return;
        }
        setLoading(true);

        // Prepare FormData
        const data = new FormData();
        data.append('name', formData.name);
        data.append('subtitle', formData.subtitle);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('homeCollection', formData.homeCollection);
        data.append('isActive', formData.isActive);

        // Append subcategories as array
        formData.subCategories.forEach(scId => {
            data.append('subCategories[]', scId);
        });

        // No image added here anymore

        try {
            await onUpdate(test._id, data);
            onClose();
        } catch (error) {
            console.error('Error updating test:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }
        setLoading(true);
        try {
            await onDelete(test._id);
            onClose();
        } catch (error) {
            console.error('Error deleting test:', error);
        } finally {
            setLoading(false);
            setDeleteConfirm(false);
        }
    };

    if (!isOpen || !test) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-[#1a237e]">Edit Test</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Current Image (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Image (Business Profile Picture)
                        </label>
                        <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Test" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 text-xs text-center p-2">No Image</div>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Test Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Name <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={!formData.category}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] disabled:bg-gray-100"
                        >
                            <option value="">Select Test Name</option>
                            {filteredMasterTests.map((t) => (
                                <option key={t._id} value={t.name}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subtitle/Note */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                                Subtitle / Note
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsPrescriptionModalOpen(true)}
                                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 transition-colors"
                            >
                                Write Prescription
                            </button>
                        </div>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="e.g., No Contrast Required"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                        />
                    </div>

                    {/* Sub Categories (Multi-select) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sub Categories (Select multiple) <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                            {!formData.category ? (
                                <span className="text-gray-400 text-sm">Select category first</span>
                            ) : filteredSubCategories.length === 0 ? (
                                <span className="text-gray-400 text-sm">No subcategories found</span>
                            ) : (
                                <div className="space-y-2">
                                    {filteredSubCategories.map((sub) => (
                                        <label key={sub._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.subCategories.includes(sub._id)}
                                                onChange={() => handleSubCategoryToggle(sub._id)}
                                                className="w-4 h-4 text-[#1a237e] rounded focus:ring-[#1a237e]"
                                            />
                                            <span className="text-sm text-gray-700">{sub.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Home Collection & Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Home Collection
                            </label>
                            <select
                                name="homeCollection"
                                value={formData.homeCollection}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                            >
                                <option value={false}>Not Available</option>
                                <option value={true}>Available</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${deleteConfirm
                                ? 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
                                : 'bg-red-50 text-[#E11D48] hover:bg-red-100 border border-red-200'
                                }`}
                        >
                            {deleteConfirm ? 'Confirm Delete?' : 'Delete'}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#0d1453] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <PrescriptionEditorModal
                    isOpen={isPrescriptionModalOpen}
                    onClose={() => setIsPrescriptionModalOpen(false)}
                    initialText={formData.subtitle}
                    onSave={(text) => setFormData(prev => ({ ...prev, subtitle: text }))}
                />
            </div>
        </div>
    );
};

export default EditTestModal;
