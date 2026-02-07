import { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { BsRobot, BsShieldCheck, BsCalendarCheck } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset Password for:', email);
    };

    const handleBack = () => {
        console.log('Back clicked');
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
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 flex items-center justify-center p-2 sm:p-4">
            {/* Main Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full max-w-[580px] flex flex-col md:flex-row">

                {/* Left Panel - White */}
                <div className="hidden md:flex w-[200px] lg:w-[220px] bg-white p-4 flex-col border-r border-gray-100">
                    <div className="mb-3">
                        <h2 className="text-sm font-bold leading-tight text-[#1a237e]">
                            Why Choose
                        </h2>
                        <h2 className="text-sm font-bold text-[#1a237e]">
                            Healthorate ?
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 flex-1">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-1 text-[#1a237e]">
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

                    <div className="mt-3">
                        <p className="text-[9px] text-gray-600 mb-2 font-medium">Find us on</p>
                        <div className="flex gap-1">
                            <button className="flex items-center gap-1 bg-black text-white px-1.5 py-1 rounded">
                                <FaApple className="w-2.5 h-2.5" />
                                <div className="text-left">
                                    <p className="text-[4px] leading-none opacity-80">Download on the</p>
                                    <p className="font-semibold text-[5px]">App Store</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-1 bg-black text-white px-1.5 py-1 rounded">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[4px] leading-none opacity-80">GET IT ON</p>
                                    <p className="font-semibold text-[5px]">Google Play</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Dark Blue */}
                <div className="flex-1 bg-[#1a237e] p-4 sm:p-5 flex flex-col justify-center md:rounded-l-3xl">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={handleBack} className="text-white hover:text-gray-200">
                            <IoArrowBack className="w-4 h-4" />
                        </button>
                        <h1 className="text-base sm:text-lg font-bold text-white">Reset Password</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email or Mobile Number"
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                        />

                        <button
                            type="submit"
                            className="w-full py-2 bg-white text-[#1a237e] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm"
                        >
                            Continue
                        </button>

                        <p className="text-[7px] sm:text-[8px] text-center text-gray-400">
                            By continuing, I accept TCP -{' '}
                            <a href="#" className="text-blue-400 hover:underline">Terms and Condition</a> &{' '}
                            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                        </p>
                    </form>
                </div>

                {/* Mobile - Left Panel Below */}
                <div className="md:hidden w-full bg-white p-3 flex flex-col border-t border-gray-100">
                    <div className="mb-2 text-center">
                        <h2 className="text-xs font-bold text-[#1a237e]">Why Choose Healthorate ?</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-1 text-[#1a237e]">
                                    {feature.icon}
                                </div>
                                <p className="text-[5px] font-medium text-gray-700">{feature.title}</p>
                                <p className="text-[5px] text-gray-500">{feature.subtitle}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-[7px] text-gray-600 font-medium">Find us on</p>
                        <div className="flex gap-1">
                            <button className="flex items-center gap-0.5 bg-black text-white px-1 py-0.5 rounded">
                                <FaApple className="w-2 h-2" />
                                <span className="text-[5px]">App Store</span>
                            </button>
                            <button className="flex items-center gap-0.5 bg-black text-white px-1 py-0.5 rounded">
                                <svg className="w-2 h-2" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.473-.471 2.367 2.367 0 0 1-.502-1.467V3.752c0-.534.178-1.027.479-1.422.089-.117.19-.226.302-.323l.193-.193z" />
                                    <path fill="#FBBC04" d="M17.556 8.234L3.609 1.814l10.184 10.184 3.763-3.764z" />
                                    <path fill="#4285F4" d="M3.609 22.186l13.947-6.42-3.763-3.764L3.609 22.186z" />
                                    <path fill="#34A853" d="M21.997 12c0 .703-.298 1.392-.835 1.864l-3.606 1.902-3.763-3.764 3.763-3.764 3.606 1.898c.537.472.835 1.161.835 1.864z" />
                                </svg>
                                <span className="text-[5px]">Google Play</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;