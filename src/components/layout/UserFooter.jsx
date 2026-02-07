import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiChevronRight } from 'react-icons/hi';

const UserFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-100 font-sans">
            {/* Main Content Area */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">

                    {/* Column 1 - Logo & Mission */}
                    <div className="flex-1 max-w-xs">
                        <img
                            src="/src/assets/images/logo.png"
                            alt="Healthorate Logo"
                            className="w-40 md:w-32 h-16 md:h-32 object-contain"
                        />
                        <p className="text-gray-600 text-[12px] leading-[1.6] font-medium">
                            At Healthorate, our mission is to revolutionize
                            healthcare by bringing affordability, accessibility,
                            and transparency to every user.
                        </p>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div className="flex-1 lg:pl-10">
                        <h4 className="text-black font-bold text-xl mb-6">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-x-1 gap-y-3">
                            <Link to="/" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> Home
                            </Link>
                            <Link to="/contact" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> Contact us
                            </Link>
                            <Link to="/about" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> About us
                            </Link>
                            <Link to="/privacy" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> Privacy Policy
                            </Link>
                            <Link to="/services" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> Services
                            </Link>
                            <Link to="/terms" className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-[#1e3a5f] transition-colors">
                                <HiChevronRight className="text-gray-400" /> Term & Condition
                            </Link>
                        </div>
                    </div>

                    {/* Column 3 - App Downloads */}
                    <div className="flex-1">
                        <h4 className="text-black font-bold text-xl mb-6">Get the Healthorate App</h4>
                        <div className="flex flex-wrap gap-4">
                            <a href="#" className="hover:opacity-90 transition-opacity">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/200px-Download_on_the_App_Store_Badge.svg.png"
                                    alt="App Store"
                                    className="h-10 rounded-md"
                                />
                            </a>
                            <a href="#" className="hover:opacity-90 transition-opacity">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/200px-Google_Play_Store_badge_EN.svg.png"
                                    alt="Google Play"
                                    className="h-10 rounded-md"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Column 4 - Get in Touch */}
                    <div className="flex-initial">
                        <h4 className="text-black font-bold text-xl mb-6">Get in Touch</h4>
                        <div className="grid grid-cols-2 gap-3 max-w-[100px]">
                            <a href="#" className="w-10 h-10 bg-[#2b3c63] text-white flex items-center justify-center rounded-lg hover:bg-[#1a2b4d] transition-colors shadow-sm">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#2b3c63] text-white flex items-center justify-center rounded-lg hover:bg-[#1a2b4d] transition-colors shadow-sm">
                                <FaLinkedinIn size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#2b3c63] text-white flex items-center justify-center rounded-lg hover:bg-[#1a2b4d] transition-colors shadow-sm">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#2b3c63] text-white flex items-center justify-center rounded-lg hover:bg-[#1a2b4d] transition-colors shadow-sm">
                                <FaWhatsapp size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Dark Bar */}
            <div className="bg-[#2a3c63] py-4">
                <div className="max-w-[1150px] mx-auto px-4 text-center">
                    <p className="text-white font-bold text-[13px] tracking-wide">
                        Copyrights 2008-25. All Rights Reserved. {' '}
                        <Link to="/privacy" className="hover:underline">Privacy</Link> | {' '}
                        <Link to="/terms" className="hover:underline">Terms</Link> | {' '}
                        <Link to="/infringement" className="hover:underline">Infringement</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;
