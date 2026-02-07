// pages/profile/ResetPasswordPage.jsx
import { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import profileService from '../../../services/profileService';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Old password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from old password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const response = await profileService.changePassword({
                currentPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.success) {
                alert('Password changed successfully!');

                // Reset form
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            const errorMessage = error.message || 'Failed to change password. Please try again.';
            alert(errorMessage);

            // If current password is wrong, show error on that field
            if (errorMessage.toLowerCase().includes('current password')) {
                setErrors({ oldPassword: errorMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className="space-y-6">
            {/* Page Description */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Password</h2>
                <p className="text-gray-500 text-sm">
                    Update your password to keep your account secure
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                {/* Old Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Old Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showPasswords.old ? 'text' : 'password'}
                            name="oldPassword"
                            placeholder="••••"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className={errors.oldPassword ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('old')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.old ? (
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
                    {errors.oldPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="••••"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={errors.newPassword ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.new ? (
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
                    {errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="1234"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.confirm ? (
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
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={handleDiscard}
                        disabled={loading}
                        className="!text-gray-600 !border-gray-300 hover:!bg-gray-50"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        size="md"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
