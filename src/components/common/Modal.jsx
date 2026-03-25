// components/common/Modal.jsx
import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true
}) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    };

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} 
                    transform transition-all animate-fadeIn max-h-[90vh] flex flex-col`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 pb-4">
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 
                                    hover:text-gray-700 transition-colors ml-auto"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="px-6 pb-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
