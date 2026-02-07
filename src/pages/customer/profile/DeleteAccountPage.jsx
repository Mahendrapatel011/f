// pages/profile/DeleteAccountPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import profileService from '../../../services/profileService';
import { STORAGE_KEYS } from '../../../config/apiConfig';


const DeleteAccountPage = () => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [password, setPassword] = useState('');
    const [reason, setReason] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleDeleteClick = () => {
        if (!reason.trim()) {
            setError('Please provide a reason for deleting your account');
            return;
        }
        setShowConfirmation(true);
        setConfirmText('');
        setPassword('');
        setError('');
    };

    const handleConfirmDelete = async () => {
        // Validation
        if (confirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        if (!password) {
            setError('Password is required');
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            const response = await profileService.deleteAccount({
                password: password,
                confirmDelete: 'DELETE',
                reason: reason
            });

            if (response.success) {
                alert('Account deleted successfully. You will be logged out.');

                // Clear local storage
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                localStorage.removeItem(STORAGE_KEYS.CUSTOMER);

                // Redirect to home page
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            const errorMessage = error.message || 'Failed to delete account. Please try again.';
            setError(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
        setConfirmText('');
    };

    return (
        <div className="space-y-6">
            {/* Warning Section */}
            <div className="max-w-2xl">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#E11D48] mb-3">
                        Delete My Account
                    </h3>

                    <p className="text-sm text-red-700 mb-4">
                        Permanently remove your account and all associated data. This action cannot be undone.
                    </p>

                    {/* Reason Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for leaving <span className="text-[#E11D48]">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Please tell us why you are deleting your account..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E11D48] focus:border-[#E11D48] text-sm h-24 resize-none"
                        />
                        {error && !showConfirmation && (
                            <p className="text-xs text-[#E11D48] mt-1">{error}</p>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleDeleteClick}
                        className="!border-[#E11D48] !text-[#E11D48] hover:!bg-red-50 w-full md:w-auto"
                    >
                        Proceed to Delete
                    </Button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmation}
                onClose={handleCancelDelete}
                size="md"
                showCloseButton={false}
                closeOnOverlayClick={false}
            >
                <div className="space-y-4">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-[#E11D48]">
                        Final Confirmation
                    </h2>

                    {/* Warning Text */}
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <p className="text-sm text-red-800 font-medium">
                            This action is permanent!
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                            You are about to delete your account. All your data will be lost.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-[#E11D48]">{error}</p>
                        </div>
                    )}

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirmation Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-bold text-[#E11D48]">DELETE</span> to confirm
                        </label>
                        <Input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder=""
                            className="font-mono text-center tracking-widest uppercase placeholder:text-gray-300"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            className="flex-1 !text-gray-600 !border-gray-300 hover:!bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting || confirmText !== 'DELETE' || !password}
                            className="flex-1 !border-[#E11D48] !bg-[#E11D48] !text-white hover:!bg-[#BE123C] 
                                disabled:!opacity-50 disabled:!cursor-not-allowed shadow-none"
                        >
                            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeleteAccountPage;
