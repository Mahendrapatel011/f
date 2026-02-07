// components/business/testCatalogue/BulkEditModal.jsx
import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const BulkEditModal = ({ isOpen, onClose, onApply, categories }) => {
    const [action, setAction] = useState('');
    const [category, setCategory] = useState('all');
    const [priceChange, setPriceChange] = useState({ type: 'fixed', value: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!action) return;

        setLoading(true);
        try {
            await onApply({
                action,
                category,
                priceChange: action === 'price' ? priceChange : null
            });
            onClose();
        } catch (error) {
            console.error('Error applying bulk edit:', error);
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
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-[#1a237e]">Bulk Edit</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apply to Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id || cat} value={cat._id || cat}>
                                    {cat.name || cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Action
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="action"
                                    value="activate"
                                    checked={action === 'activate'}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="text-gray-700">Activate all tests</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="action"
                                    value="deactivate"
                                    checked={action === 'deactivate'}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="text-gray-700">Deactivate all tests</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="action"
                                    value="price"
                                    checked={action === 'price'}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="text-gray-700">Update prices</span>
                            </label>
                        </div>
                    </div>

                    {/* Price Change Options */}
                    {action === 'price' && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div className="flex gap-3">
                                <select
                                    value={priceChange.type}
                                    onChange={(e) => setPriceChange(prev => ({ ...prev, type: e.target.value }))}
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e]"
                                >
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="percent">Percentage (%)</option>
                                </select>
                                <input
                                    type="number"
                                    value={priceChange.value}
                                    onChange={(e) => setPriceChange(prev => ({ ...prev, value: e.target.value }))}
                                    placeholder="Enter value"
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e]"
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Use negative values to decrease prices
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!action || loading}
                        className="w-full py-3 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#0d1453] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Applying...' : 'Apply Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkEditModal;