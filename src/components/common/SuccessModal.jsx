// components/common/SuccessModal.jsx
import Modal from './Modal';
import Button from './Button';

const SuccessModal = ({
    isOpen,
    onClose,
    title = 'Success!',
    message,
    buttonText = 'Done'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={true}
            closeOnOverlayClick={true}
        >
            <div className="text-center space-y-4 py-2">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                </h3>

                {/* Message */}
                {message && (
                    <p className="text-sm text-gray-600">
                        {message}
                    </p>
                )}

                {/* Done Button */}
                <Button
                    variant="secondary"
                    size="md"
                    onClick={onClose}
                    className="w-full"
                >
                    {buttonText}
                </Button>
            </div>
        </Modal>
    );
};

export default SuccessModal;
