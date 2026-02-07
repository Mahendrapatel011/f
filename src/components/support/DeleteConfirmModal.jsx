// components/support/DeleteConfirmModal.jsx
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../common/Button';

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Confirmation',
    message = 'Are you sure you want to delete this item?',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false
}) => {
    if (!isOpen) return null;

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
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <FaExclamationTriangle className="text-[#E11D48] text-xl" />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed pt-2">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 p-5 pt-0">
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
                        variant="danger"
                        size="md"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Deleting...' : confirmText}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default DeleteConfirmModal;