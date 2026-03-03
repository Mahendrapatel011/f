// components/cart/AddAddressModal.jsx
import { useState } from 'react';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import Button from '../common/Button';

const AddAddressModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        addressLine: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave?.(formData);
            handleDiscard();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        setFormData({
            name: '',
            addressLine: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
        });
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
                <div className="flex items-center gap-3 p-5 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <h3 className="text-xl font-semibold text-gray-800">Add Address</h3>
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Address<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="addressLine"
                            placeholder="Address (House no., building, area, etc)"
                            value={formData.addressLine}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                        />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                City<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                    focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                    focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                            />
                        </div>
                    </div>

                    {/* Country & Pincode */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                    focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                                    focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleDiscard}
                            className="flex-1 !border-gray-300 !text-gray-600"
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            size="md"
                            disabled={loading || !formData.name || !formData.addressLine || !formData.city}
                            className="flex-1"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddAddressModal;