// components/business/testCatalogue/AddTestModal.jsx
import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const AddTestModal = ({ isOpen, onClose, onAdd, categories = [], subCategories = [], masterTests = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        category: '',
        subCategories: [], // Array for multiple subcategories
        price: '',
        isActive: true,
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [filteredMasterTests, setFilteredMasterTests] = useState([]);

    // Filter subcategories and master tests when category changes
    useEffect(() => {
        if (formData.category) {
            const relevantSubCats = subCategories.filter(
                sub => (sub.category?._id || sub.category) === formData.category
            );
            setFilteredSubCategories(relevantSubCats);

            const relevantMasterTests = masterTests.filter(
                test => (test.category?._id || test.category) === formData.category
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
                subCategories: [], // Reset subcategories
                name: '' // Reset test name
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
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('subtitle', formData.subtitle);
            data.append('category', formData.category);

            // Append multiple subcategories
            formData.subCategories.forEach(id => {
                data.append('subCategories[]', id);
            });

            data.append('price', formData.price);
            data.append('isActive', formData.isActive);

            if (formData.images) {
                formData.images.forEach(file => {
                    data.append('images', file);
                });
            }

            await onAdd(data);
            setFormData({ name: '', subtitle: '', category: '', subCategories: [], price: '', isActive: true, images: [] });
            onClose();
        } catch (error) {
            console.error('Error adding test:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    <h2 className="text-xl font-bold text-[#1a237e]">Add New Test</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Category First */}
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

                    {/* Test Name (from Master) */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle / Note
                        </label>
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

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Images (Max 2)
                        </label>
                        <input
                            type="file"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                if (files.length > 2) {
                                    alert('You can only upload up to 2 images');
                                    return;
                                }
                                setFormData(prev => ({ ...prev, images: files }));
                            }}
                            multiple
                            accept="image/*"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g., 3500"
                            required
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#0d1453] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add Test'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTestModal;