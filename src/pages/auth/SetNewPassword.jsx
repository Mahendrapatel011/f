import { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsRobot, BsShieldCheck, BsCalendarCheck } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SetNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const email = location.state?.email;
    const otp = location.state?.otp;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !otp) {
            toast.error('Invalid session. Please start again.');
            navigate('/forgot-password');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                identifier: email,
                otp: otp,
                password: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.data.success) {
                toast.success('Password reset successful! Please login.');
                navigate('/login/customer');
            }
        } catch (error) {
            console.error('Reset Password error:', error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const features = [
        {
            icon: <HiOutlineCurrencyRupee className="w-5 h-5 md:w-6 md:h-6" />,
            title: 'Transparent',
            subtitle: 'Pricing'
        },
        {
            icon: <BsRobot className="w-5 h-5 md:w-6 md:h-6" />,
            title: 'AI-Powered',
            subtitle: 'Comparisons'
        },
        {
            icon: <BsShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
            title: 'Verified &',
            subtitle: 'Accredited Labs'
        },
        {
            icon: <BsCalendarCheck className="w-5 h-5 md:w-6 md:h-6" />,
            title: 'Seamless Test',
            subtitle: 'Booking'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-start justify-center p-4 pt-20 sm:p-6 lg:p-8">
            {/* Main Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full max-w-[700px] flex flex-col md:flex-row">

                {/* Left Panel - White - Why Choose Section */}
                <div className="hidden md:flex w-[240px] lg:w-[260px] bg-white p-4 sm:p-5 flex-col border-r border-gray-100">
                    {/* Heading */}
                    <div className="mb-3 md:mb-4">
                        <h2 className="text-base sm:text-lg font-bold leading-tight text-[#1a237e]">
                            Why Choose
                        </h2>
                        <h2 className="text-base sm:text-lg font-bold text-[#1a237e]">
                            Healthorate ?
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2 text-[#1a237e]">
                                    {feature.icon}
                                </div>
                                <p className="text-[8px] sm:text-[10px] font-medium leading-tight text-gray-700">
                                    {feature.title}
                                </p>
                                <p className="text-[8px] sm:text-[10px] text-gray-500">
                                    {feature.subtitle}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Find Us On Section */}
                    <div className="mt-3 md:mt-4">
                        <p className="text-xs text-gray-600 mb-2 sm:mb-3 font-medium">Find us on</p>
                        <div className="flex gap-2">
                            {/* App Store Button */}
                            <button className="flex items-center gap-1.5 bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                                <FaApple className="w-3 h-3 sm:w-4 sm:h-4" />
                                <div className="text-left">
                                    <p className="text-[5px] leading-none opacity-80">Download on the</p>
                                    <p className="font-semibold text-[7px]">App Store</p>
                                </div>
                            </button>

                            {/* Google Play Button */}
                            <button className="flex items-center gap-1.5 bg-black text-white px-2 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[5px] leading-none opacity-80">GET IT ON</p>
                                    <p className="font-semibold text-[7px]">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Dark Blue - Set New Password Form */}
                <div className="flex-1 bg-[#1e3a5f] p-4 sm:p-6 flex flex-col justify-center md:rounded-l-3xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <button
                            onClick={handleBack}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <IoArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-white">Set New Password</h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password Input */}
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 placeholder-gray-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? (
                                    <MdVisibilityOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your new password"
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 placeholder-gray-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <MdVisibilityOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 sm:py-3 bg-white text-[#1e3a5f] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting Password...' : 'Continue'}
                        </button>

                        {/* Terms & Privacy */}
                        <p className="text-[8px] sm:text-[10px] text-center text-gray-400 mt-4">
                            By continuing, I accept TCP -{' '}
                            <a href="#" className="text-blue-400 hover:underline">Terms and Condition</a> &{' '}
                            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                        </p>
                    </form>
                </div>

                {/* Left Panel - Mobile Only (Shows below the form) */}
                <div className="md:hidden w-full bg-white p-4 flex flex-col border-t border-gray-100">
                    {/* Heading */}
                    <div className="mb-3 text-center">
                        <h2 className="text-base font-bold leading-tight text-[#1a237e]">
                            Why Choose Healthorate ?
                        </h2>
                    </div>

                    {/* Features Grid - Horizontal on mobile */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-1 text-[#1a237e]">
                                    {feature.icon}
                                </div>
                                <p className="text-[7px] font-medium leading-tight text-gray-700">
                                    {feature.title}
                                </p>
                                <p className="text-[7px] text-gray-500">
                                    {feature.subtitle}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Find Us On Section - Mobile */}
                    <div className="flex items-center justify-center gap-3">
                        <p className="text-[10px] text-gray-600 font-medium">Find us on</p>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-md">
                                <FaApple className="w-3 h-3" />
                                <span className="text-[7px] font-medium">App Store</span>
                            </button>
                            <button className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-md">
                                <svg className="w-3 h-3" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <span className="text-[7px] font-medium">Google Play</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetNewPassword;