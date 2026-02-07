import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const BusinessRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Real-time validation
        const newErrors = { ...errors };

        // Email validation
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                newErrors.email = 'Please enter a valid email address';
            } else {
                delete newErrors.email;
            }
        }

        // Mobile validation
        if (name === 'mobile') {
            const mobileRegex = /^[6-9]\d{9}$/;
            if (value && !mobileRegex.test(value)) {
                newErrors.mobile = 'Please enter a valid 10-digit mobile number';
            } else {
                delete newErrors.mobile;
            }
        }

        // Password validation
        if (name === 'password') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (value && !passwordRegex.test(value)) {
                newErrors.password = 'Password must include uppercase, lowercase, number, and special character (min 8 chars)';
            } else {
                delete newErrors.password;
            }
        }

        // Confirm Password validation
        if (name === 'confirmPassword') {
            if (value && value !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            } else {
                delete newErrors.confirmPassword;
            }
        }

        // Also check confirm password when password changes
        if (name === 'password' && formData.confirmPassword) {
            if (formData.confirmPassword !== value) {
                newErrors.confirmPassword = 'Passwords do not match';
            } else {
                delete newErrors.confirmPassword;
            }
        }

        // Clear error when field is empty
        if (!value && name !== 'agreeTerms') {
            delete newErrors[name];
        }

        setErrors(newErrors);
    };

    // Set this to true to skip OTP verification for mobile registration
    const SKIP_MOBILE_OTP = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Regex patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[6-9]\d{9}$/;

        if (!formData.businessName) newErrors.businessName = 'Business Name is required';
        if (!formData.ownerName) newErrors.ownerName = 'Owner Name is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.mobile) {
            newErrors.mobile = 'Mobile Number is required';
        } else if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Password must include uppercase, lowercase, number, and special character (min 8 chars)';
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/api/business/auth/register', {
                    businessName: formData.businessName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    mobile: formData.mobile,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                });

                if (response.data.success) {
                    toast.success(response.data.message);

                    // Check if we should skip OTP for mobile
                    // Business registration asks for both email and mobile, so we can assume mobile registration bypass applies
                    if (SKIP_MOBILE_OTP) {
                        navigate('/login/business');
                    } else {
                        navigate('/otp-verify/business', {
                            state: {
                                email: formData.email,
                                mode: 'registration'
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Registration error:', error);

                // Handle field-specific errors from backend
                if (error.response?.data?.errors) {
                    const backendErrors = {};
                    error.response.data.errors.forEach(err => {
                        backendErrors[err.field] = err.message;
                    });
                    setErrors(backendErrors);
                    toast.error('Please fix the errors in the form');
                } else {
                    toast.error(error.response?.data?.message || 'Something went wrong');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
            {/* Register Card */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a237e] text-center mb-6">
                    Business Register
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Business Name */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Business Name
                        </label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Enter Business Name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
                    </div>

                    {/* Owner Name */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Owner Name
                        </label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            placeholder="Enter Owner Name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && (
                            <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Enter your mobile number"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.mobile && (
                            <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.mobile}</p>
                        )}
                    </div>

                    {/* Create Password */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Create Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
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
                        {errors.password ? (
                            <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.password}</p>
                        ) : (
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">
                                Password must include uppercase, lowercase, number, and special character (min 8 chars)
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:border-transparent text-sm pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
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
                        {errors.confirmPassword && <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#1a237e] border-gray-300 rounded focus:ring-[#1a237e] mt-0.5"
                        />
                        <label className="text-[10px] sm:text-xs text-gray-600">
                            I have read and agree with{' '}
                            <a href="#" className="text-[#1a237e] hover:underline">Terms of Service</a> and our{' '}
                            <a href="#" className="text-[#1a237e] hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    {errors.agreeTerms && (
                        <p className="text-[10px] sm:text-xs text-red-500">{errors.agreeTerms}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#0d1442] transition-colors text-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>

                    <p className="text-xs text-center text-gray-600 mt-4">
                        Already have a business account?{' '}
                        <Link to="/login/business" className="text-[#1a237e] font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default BusinessRegister;