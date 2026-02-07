import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const BusinessOtpVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(104);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const email = location.state?.email;
    const mode = location.state?.mode || 'registration'; // 'registration' or 'reset'

    useEffect(() => {
        if (!email) {
            toast.error('Invalid access. Please try again.');
            navigate('/login/business');
        }
    }, [email, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Format timer to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
            if (mode === 'registration') {
                const response = await axios.post('http://localhost:5000/api/business/auth/verify-otp', {
                    email,
                    otp: otpValue
                });

                if (response.data.success) {
                    toast.success('Registration successful! Please complete KYC.');
                    localStorage.setItem('businessToken', response.data.data.token);
                    localStorage.setItem('businessData', JSON.stringify(response.data.data.business));
                    navigate('/kyc/business');
                }
            } else if (mode === 'reset') {
                // For reset password flow
                const response = await axios.post('http://localhost:5000/api/business/auth/verify-reset-otp', {
                    identifier: email,
                    otp: otpValue
                });

                if (response.data.success) {
                    // Navigate to set new password page (need to create/update it)
                    navigate('/set-new-password/business', {
                        state: {
                            identifier: email, // ensure we pass identifier
                            otp: otpValue
                        }
                    });
                }
            } else if (mode === 'login') {
                // Login OTP Verify
                const response = await axios.post('http://localhost:5000/api/business/auth/verify-login-otp', {
                    identifier: email, // reusing email variable which holds identifier
                    otp: otpValue
                });

                if (response.data.success) {
                    toast.success('Login successful!');
                    localStorage.setItem('businessToken', response.data.data.token);
                    localStorage.setItem('businessData', JSON.stringify(response.data.data.business));

                    const business = response.data.data.business;
                    if (business.kycStatus === 'pending') {
                        toast('Please complete your KYC', { icon: '⚠️' });
                        navigate('/kyc/business');
                    } else {
                        navigate('/business/dashboard');
                    }
                }
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/business/auth/resend-otp', {
                identifier: email,
                type: mode
            });

            if (response.data.success) {
                setTimer(104);
                setOtp(['', '', '', '']);
                inputRefs.current[0]?.focus();
                toast.success('OTP resent successfully');
            }
        } catch (error) {
            console.error('Resend OTP Error:', error);
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
            {/* OTP Card */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e] text-center mb-2">
                    {mode === 'registration' ? 'Verify Account' : mode === 'login' ? 'Login Verification' : 'Reset Password'}
                </h1>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-500 text-center mb-5">
                    Please enter the code we sent to {email}
                </p>

                {/* Form */}
                <form onSubmit={handleVerify} className="space-y-4">
                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-3">
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
                                className="w-12 h-12 sm:w-14 sm:h-14 bg-white border-2 border-gray-300 rounded-lg text-center text-xl font-bold text-[#1a237e] focus:outline-none focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/20"
                            />
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            <span className="text-[#1a237e] font-semibold">{formatTime(timer)}</span> remaining
                        </p>
                    </div>

                    {/* Resend Link */}
                    {timer === 0 && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-xs sm:text-sm text-[#1a237e] hover:underline font-medium"
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={otp.some(digit => !digit) || loading}
                        className="w-full py-2.5 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#0d1442] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BusinessOtpVerify;