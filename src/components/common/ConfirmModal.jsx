// components/common/ConfirmModal.jsx
import { FaTimes, FaExclamationCircle } from 'react-icons/fa';
import Button from './Button';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmation',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    variant = 'danger' // 'danger', 'warning', 'info'
}) => {
    if (!isOpen) return null;

    const variantConfig = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-[#E11D48]',
            buttonVariant: 'danger'
        },
        warning: {
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-500',
            buttonVariant: 'primary'
        },
        info: {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-500',
            buttonVariant: 'secondary'
        }
    };

    const config = variantConfig[variant] || variantConfig.danger;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-full max-w-sm bg-white rounded-2xl shadow-xl z-50">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <FaExclamationCircle className={`${config.iconColor} text-xl`} />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed pt-2">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 px-6 pb-6">
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 !border-gray-300 !text-gray-600 hover:!bg-gray-50"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={config.buttonVariant}
                        size="md"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
