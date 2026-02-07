import { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsRobot, BsShieldCheck, BsCalendarCheck } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailOrMobile: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Set this to true to skip OTP verification for mobile registration/login
    const SKIP_MOBILE_OTP = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        const isEmail = emailRegex.test(formData.emailOrMobile);
        const isMobile = mobileRegex.test(formData.emailOrMobile);

        if (!formData.fullName) {
            toast.error('Full Name is required');
            return;
        }

        if (!formData.emailOrMobile) {
            toast.error('Email or Mobile Number is required');
            return;
        }

        if (!isEmail && !isMobile) {
            toast.error('Please enter a valid email or 10-digit mobile number');
            return;
        }

        if (!formData.password) {
            toast.error('Password is required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                identifier: formData.emailOrMobile,
                name: formData.fullName,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);

                // Check if we should skip OTP for mobile
                if (SKIP_MOBILE_OTP && isMobile) {
                    navigate('/login/customer');
                } else {
                    navigate('/otp-verify', {
                        state: {
                            email: formData.emailOrMobile,
                            mode: 'registration'
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        toast.error('Google Sign Up is not implemented yet.');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const features = [
        {
            icon: <HiOutlineCurrencyRupee className="w-5 h-5" />,
            title: 'Transparent',
            subtitle: 'Pricing'
        },
        {
            icon: <BsRobot className="w-5 h-5" />,
            title: 'AI-Powered',
            subtitle: 'Comparisons'
        },
        {
            icon: <BsShieldCheck className="w-5 h-5" />,
            title: 'Verified &',
            subtitle: 'Accredited Labs'
        },
        {
            icon: <BsCalendarCheck className="w-5 h-5" />,
            title: 'Seamless Test',
            subtitle: 'Booking'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-start justify-center p-4 pt-20 sm:p-6 lg:p-8">
            {/* Main Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full max-w-[700px] flex flex-col md:flex-row">

                {/* Left Panel - White */}
                <div className="hidden md:flex w-[280px] bg-white p-6 flex-col border-r border-gray-100 justify-between relative">
                    {/* Top Content */}
                    <div>
                        {/* Heading */}
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-bold leading-tight text-[#1a237e]">
                                Why Choose
                            </h2>
                            <h2 className="text-xl font-bold text-[#1a237e]">
                                Healthorate ?
                            </h2>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mb-2 text-[#1a237e] shadow-sm">
                                        <div className="scale-125">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold leading-tight text-gray-800">
                                        {feature.title}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-medium">
                                        {feature.subtitle}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Find Us On Section */}
                    <div>
                        <p className="text-[10px] text-gray-500 mb-2 font-semibold text-center">Find us on</p>
                        <div className="flex gap-2 justify-center">
                            {/* App Store Button */}
                            <button className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                                <FaApple className="w-4 h-4" />
                                <div className="text-left">
                                    <p className="text-[6px] leading-none opacity-80">Download on the</p>
                                    <p className="font-bold text-[8px]">App Store</p>
                                </div>
                            </button>

                            {/* Google Play Button */}
                            <button className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[6px] leading-none opacity-80">GET IT ON</p>
                                    <p className="font-bold text-[8px]">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Dark Blue */}
                <div className="flex-1 bg-[#1e3a5f] p-5 sm:p-6 flex flex-col justify-center md:rounded-l-3xl">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <button
                            onClick={handleBack}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <IoArrowBack className="w-4 h-4" />
                        </button>
                        <h1 className="text-base sm:text-lg font-bold text-white">Register</h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Email or Mobile Number */}
                        <div>
                            <label className="text-xs text-gray-300 mb-1.5 block">Email or Mobile Number</label>
                            <input
                                type="text"
                                name="emailOrMobile"
                                value={formData.emailOrMobile}
                                onChange={handleInputChange}
                                placeholder="Enter Email or Mobile Number"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="text-xs text-gray-300 mb-1.5 block">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter Full Name"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Create Password Section */}
                        <div>
                            <label className="text-xs text-gray-300 mb-1.5 block">Create your password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <MdVisibilityOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Section */}
                        <div>
                            <label className="text-xs text-gray-300 mb-1.5 block">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400 pr-10"
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
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Continue'}
                        </button>

                        {/* OR Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-500"></div>
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-500"></div>
                        </div>

                        {/* Google Sign Up Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="w-full py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-600">Sign Up with Google</span>
                        </button>

                        {/* Already have account */}
                        <p className="text-[10px] text-center text-gray-300">
                            Already have an account?{' '}
                            <a
                                href="/login/customer"
                                className="text-white font-semibold hover:underline"
                            >
                                Login
                            </a>
                        </p>

                        {/* Terms & Privacy */}
                        <p className="text-[6px] sm:text-[7px] text-center text-gray-400">
                            By continuing, I accept TCP -{' '}
                            <a href="#" className="text-blue-400 hover:underline">Terms and Condition</a> &{' '}
                            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                        </p>
                    </form>
                </div>

                {/* Left Panel - Mobile Only (Shows below the form) */}
                <div className="md:hidden w-full bg-white p-3 flex flex-col border-t border-gray-100">
                    {/* Heading */}
                    <div className="mb-2 text-center">
                        <h2 className="text-xs font-bold leading-tight text-[#1a237e]">
                            Why Choose Healthorate ?
                        </h2>
                    </div>

                    {/* Features Grid - Horizontal on mobile */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-1 text-[#1a237e]">
                                    {feature.icon}
                                </div>
                                <p className="text-[5px] font-medium leading-tight text-gray-700">
                                    {feature.title}
                                </p>
                                <p className="text-[5px] text-gray-500">
                                    {feature.subtitle}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Find Us On Section - Mobile */}
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-[7px] text-gray-600 font-medium">Find us on</p>
                        <div className="flex gap-1">
                            <button className="flex items-center gap-0.5 bg-black text-white px-1 py-0.5 rounded">
                                <FaApple className="w-2 h-2" />
                                <span className="text-[5px] font-medium">App Store</span>
                            </button>
                            <button className="flex items-center gap-0.5 bg-black text-white px-1 py-0.5 rounded">
                                <svg className="w-2 h-2" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <span className="text-[5px] font-medium">Google Play</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;