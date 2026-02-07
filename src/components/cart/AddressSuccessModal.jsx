// components/cart/AddressSuccessModal.jsx
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../common/Button';

const AddressSuccessModal = ({ isOpen, onClose, address }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6 text-center">

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <FaCheckCircle className="text-6xl text-green-500" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Default Address
                </h3>

                {/* Address */}
                <p className="text-gray-600 text-sm mb-6">
                    {address?.address}, {address?.city}, {address?.state}, {address?.pincode}
                </p>

                {/* Continue Button */}
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onClose}
                    className="w-full"
                >
                    Continue
                </Button>
            </div>
        </>
    );
};

export default AddressSuccessModal;