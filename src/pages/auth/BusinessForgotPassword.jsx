import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const BusinessForgotPassword = () => {
    const navigate = useNavigate();
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailOrMobile) {
            setError('Please enter your email or mobile number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/business/auth/forgot-password', {
                identifier: emailOrMobile
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/otp-verify/business', {
                    state: {
                        email: emailOrMobile,
                        mode: 'reset'
                    }
                });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
            {/* Reset Password Card */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e] text-center mb-5">
                    Reset Password
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email or Mobile Number */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Email or Mobile Number
                        </label>
                        <input
                            type="text"
                            value={emailOrMobile}
                            onChange={(e) => {
                                setEmailOrMobile(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter Email or Mobile Number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm"
                        />
                        {error && (
                            <p className="text-[10px] sm:text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#0d1442] transition-colors text-sm disabled:opacity-50"
                    >
                        {loading ? 'Sending OTP...' : 'Submit'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login/business" className="text-xs sm:text-sm text-[#1a237e] font-medium hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessForgotPassword;