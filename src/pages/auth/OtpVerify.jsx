import { useState, useRef, useEffect } from 'react';
import { FaApple } from 'react-icons/fa';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsRobot, BsShieldCheck, BsCalendarCheck } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const OtpVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(269); // 4:29 in seconds
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const email = location.state?.email;
    const mode = location.state?.mode || 'registration'; // 'registration' or 'reset' or 'login'

    // Timer countdown
    useEffect(() => {
        if (timer > 0 && !isExpired) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setIsExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isExpired]);

    // Format timer to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 4) newOtp[i] = char;
        });
        setOtp(newOtp);

        const focusIndex = Math.min(pastedData.length, 3);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) return;

        setLoading(true);
        try {
            let endpoint = 'http://localhost:5000/api/auth/verify-otp';
            if (mode === 'reset') {
                endpoint = 'http://localhost:5000/api/auth/verify-reset-otp';
            }

            const response = await axios.post(endpoint, {
                identifier: email,
                otp: otpValue
            });

            if (response.data.success) {
                toast.success('OTP Verified successfully');

                if (mode === 'registration' || mode === 'login') {
                    // Save token and login user
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data.customer));
                    navigate('/listing');
                } else if (mode === 'reset') {
                    // Navigate to set new password with OTP and email
                    navigate('/set-new-password', {
                        state: {
                            email: email,
                            otp: otpValue
                        }
                    });
                }
            }
        } catch (error) {
            console.error('OTP Verify error:', error);
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-otp', {
                identifier: email,
                type: mode === 'reset' ? 'reset' : 'registration'
            });
            setTimer(269);
            setIsExpired(false);
            setOtp(['', '', '', '']);
            inputRefs.current[0]?.focus();
            toast.success('OTP resent successfully');
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
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

                {/* Left Panel - White - Why Choose Section (Hidden on mobile, shown on md+) */}
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

                {/* Right Panel - Dark Blue - OTP Form */}
                <div className="flex-1 bg-[#1e3a5f] p-4 sm:p-6 flex flex-col justify-center md:rounded-l-3xl">
                    {/* OTP Header */}
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <button
                            onClick={handleBack}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <IoArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-white">OTP Verification</h1>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleVerify} className="space-y-4">
                        {/* Description */}
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-300">
                                Enter the OTP sent to your {email?.includes('@') ? 'email' : 'mobile number'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300">
                                to continue.
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-400">
                                Your OTP expires in{' '}
                                <span className="text-white font-semibold">{formatTime(timer)}</span>.
                            </p>
                        </div>

                        {/* Resend Link */}
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-400">
                                Didn't get the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                                >
                                    Resend.
                                </button>
                            </p>
                        </div>

                        {/* OTP Input Boxes */}
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-9 h-10 sm:w-11 sm:h-12 bg-white border-2 border-gray-300 rounded-lg text-center text-lg sm:text-xl font-bold text-[#1e3a5f] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {isExpired && (
                            <p className="text-xs sm:text-sm text-red-400 text-center">
                                OTP expired!{' '}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-red-400 hover:text-red-300 font-medium underline"
                                >
                                    Resend
                                </button>
                            </p>
                        )}

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={otp.some(digit => !digit) || loading}
                            className="w-full py-2.5 sm:py-3 bg-white text-[#1e3a5f] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>

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

export default OtpVerify;