import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About us', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Contact us', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Condition', path: '/terms' }
    ];

    return (
        <footer className="bg-[#1e3a5f] text-white">
            {/* Main Footer content */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">

                    {/* Column 1 - Logo & About */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="inline-block border border-white/20 px-4 py-2 bg-[#162d4a]">
                                <h3 className="text-2xl font-bold leading-none tracking-tight text-white">Healthorate</h3>
                                <p className="text-[10px] uppercase font-semibold text-white/80 mt-1">Health Checkup at Your Doorstep</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-[13px] leading-relaxed max-w-sm">
                            At Healthorate, our mission is to revolutionize
                            healthcare by bringing affordability, accessibility and
                            transparency to every user.
                        </p>
                    </div>

                    {/* Column 2 - App & Social */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">Get the Healthorate App</h4>
                            <div className="flex gap-3">
                                <a href="#" className="hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/200px-Download_on_the_App_Store_Badge.svg.png"
                                        alt="App Store"
                                        className="h-9"
                                    />
                                </a>
                                <a href="#" className="hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/200px-Google_Play_Store_badge_EN.svg.png"
                                        alt="Google Play"
                                        className="h-9"
                                    />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Get in Touch</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white text-[#1e3a5f] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                                    <FaFacebookF size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-[#1e3a5f] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                                    <FaLinkedinIn size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-[#1e3a5f] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                                    <FaInstagram size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white text-[#1e3a5f] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm">
                                    <FaWhatsapp size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 3 - Quick Links */}
                    <div className="md:pl-10">
                        <h4 className="font-bold text-xl mb-6 text-white/90">Quick Links</h4>
                        <ul className="flex flex-col gap-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-white hover:text-white/70 font-semibold text-md transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* White Bottom Bar */}
            <div className="bg-white py-3">
                <div className="max-w-[1150px] mx-auto px-4 text-center">
                    <p className="text-black font-bold text-[13px]">
                        Copyrights 2008-25. All Rights Reserved. {' '}
                        <span className="font-medium text-gray-800 tracking-wide">
                            <Link to="/privacy" className="hover:underline">Privacy</Link> | {' '}
                            <Link to="/terms" className="hover:underline">Terms</Link> | {' '}
                            <Link to="/infringement" className="hover:underline">Infringement</Link>
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;