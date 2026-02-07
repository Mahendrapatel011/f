import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsRobot, BsShieldCheck, BsCalendarCheck } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const SKIP_MOBILE_OTP = true;

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [googleError, setGoogleError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                identifier: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                if (response.data.requireOtp) {
                    const mobileRegex = /^[6-9]\d{9}$/;
                    const isMobile = mobileRegex.test(formData.email);

                    // Skip OTP for mobile logins if enabled
                    if (SKIP_MOBILE_OTP && isMobile) {
                        if (response.data.data?.token) {
                            localStorage.setItem('token', response.data.data.token);
                            localStorage.setItem('user', JSON.stringify(response.data.data.customer));
                            toast.success('Login successful!');
                            navigate('/listing');
                            return;
                        }
                    }

                    // Otherwise, proceed to OTP verification
                    toast.success(response.data.message || 'OTP sent to your email');
                    navigate('/otp-verify', {
                        state: {
                            email: formData.email,
                            mode: 'login'
                        }
                    });
                } else {
                    toast.success('Login successful!');
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data.customer));
                    navigate('/listing');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast.error('Google Login is not implemented yet.');
        setGoogleError(true);
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
            {/* Main Login Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full max-w-[800px] flex flex-col md:flex-row">

                {/* Left Panel - White - Why Choose Section */}
                <div className="hidden md:flex w-[260px] lg:w-[300px] bg-white p-6 flex-col border-r border-gray-100">
                    {/* Heading */}
                    <div className="mb-3 md:mb-4 text-center md:text-left">
                        <h2 className="text-base sm:text-lg font-bold leading-tight text-[#1a237e]">
                            Why Choose
                        </h2>
                        <h2 className="text-base sm:text-lg font-bold text-[#1a237e]">
                            Healthorate ?
                        </h2>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-2 sm:gap-4 flex-1">
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
                    <div className="mt-3 md:mt-4 hidden sm:block">
                        <p className="text-xs text-gray-600 mb-2 sm:mb-3 font-medium text-center md:text-left">Find us on</p>
                        <div className="flex gap-2 justify-center md:justify-start">
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

                {/* Right Panel - Dark Blue - Login Form */}
                <div className="flex-1 bg-[#1e3a5f] p-4 sm:p-6 flex flex-col justify-center md:rounded-l-3xl">
                    {/* Login Header */}
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <button
                            onClick={handleBack}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <IoArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-white">Login</h1>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                        {/* Email/Mobile Input */}
                        <div>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter Email or Mobile Number"
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400 pr-10"
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white"
                                />
                                <span className="text-xs sm:text-sm text-white">Remember Me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs sm:text-sm text-red-400 hover:text-red-300 font-medium"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 sm:py-2.5 bg-white text-[#1e3a5f] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Continue'}
                        </button>

                        {/* OR Divider */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex-1 h-px bg-gray-500"></div>
                            <span className="text-[10px] sm:text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-500"></div>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-xs sm:text-sm font-medium text-gray-600">Sign in with Google</span>
                        </button>

                        {/* Google Error Message */}
                        {googleError && (
                            <p className="text-[10px] sm:text-xs text-red-400 text-center">
                                Couldn't sign you in with google. Try again later.
                            </p>
                        )}

                        {/* Create Account Link */}
                        <p className="text-xs sm:text-sm text-center text-white">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-white font-bold hover:underline"
                            >
                                Create an account.
                            </Link>
                        </p>

                        {/* Terms & Privacy */}
                        <p className="text-[8px] sm:text-[10px] text-center text-gray-400">
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

export default Login;