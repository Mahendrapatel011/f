// components/cart/ChangeAddressModal.jsx
import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import Button from '../common/Button';

const ChangeAddressModal = ({ 
    isOpen, 
    onClose, 
    addresses = [], 
    selectedAddressId,
    onSelectAddress, 
    onAddNewAddress 
}) => {
    const [selected, setSelected] = useState(selectedAddressId);

    const handleNext = () => {
        onSelectAddress?.(selected);
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
                    <h3 className="text-xl font-semibold text-gray-800">Change Address</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Saved Addresses Label */}
                    <p className="text-sm text-gray-500 mb-4">Saved Address</p>

                    {/* Address List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {addresses.map((address) => (
                            <label
                                key={address.id}
                                className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                                    transition-colors ${selected === address.id 
                                        ? 'border-[#1e3a5f] bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selected === address.id}
                                    onChange={() => setSelected(address.id)}
                                    className="mt-1 w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{address.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {address.address}, {address.city}, {address.state}, {address.pincode}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleNext}
                        disabled={!selected}
                        className="w-full mt-4"
                    >
                        Next
                    </Button>

                    {/* Add Address Button */}
                    <button
                        onClick={onAddNewAddress}
                        className="w-full mt-3 py-3 border-2 border-dashed border-gray-300 
                            rounded-xl text-gray-600 font-medium
                            hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors
                            flex items-center justify-center gap-2"
                    >
                        <FaPlus className="text-sm" />
                        Add Address
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChangeAddressModal;