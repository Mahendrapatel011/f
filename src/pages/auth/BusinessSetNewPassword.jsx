import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';

const BusinessSetNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const identifier = location.state?.identifier;
    const otp = location.state?.otp;

    useEffect(() => {
        if (!identifier || !otp) {
            toast.error('Invalid access. Please try again.');
            navigate('/forgot-password/business');
        }
    }, [identifier, otp, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setError('Please enter both password fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/business/auth/reset-password', {
                identifier,
                otp,
                password,
                confirmPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login/business');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e] text-center mb-6">
                    Set New Password
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <MdVisibilityOff className="w-5 h-5" />
                                ) : (
                                    <MdVisibility className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <MdVisibilityOff className="w-5 h-5" />
                                ) : (
                                    <MdVisibility className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className="text-xs text-red-500 mt-2">{error}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#0d1442] transition-colors text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BusinessSetNewPassword;
