import { 
    FaEye, 
    FaClock, 
    FaRobot, 
    FaChartLine, 
    FaShieldAlt, 
    FaStar, 
    FaCalendarCheck, 
    FaThumbsUp 
} from 'react-icons/fa';

const WhyChooseSection = () => {
    const features = [
        {
            icon: <FaEye className="w-5 h-5" />,
            title: 'Transparent Pricing'
        },
        {
            icon: <FaClock className="w-5 h-5" />,
            title: 'Save Time & Money'
        },
        {
            icon: <FaRobot className="w-5 h-5" />,
            title: 'AI-Powered Comparisons'
        },
        {
            icon: <FaChartLine className="w-5 h-5" />,
            title: 'Verified Business Listing'
        },
        {
            icon: <FaShieldAlt className="w-5 h-5" />,
            title: 'Verified & Accredited Labs'
        },
        {
            icon: <FaStar className="w-5 h-5" />,
            title: 'Verified Review & Rating'
        },
        {
            icon: <FaCalendarCheck className="w-5 h-5" />,
            title: 'Seamless Test Booking'
        },
        {
            icon: <FaThumbsUp className="w-5 h-5" />,
            title: 'Convenient & Reliable'
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl">
                    
                    {/* Left - Content */}
                    <div className="lg:w-1/2 bg-[#1e3a5f] p-8 md:p-10 lg:p-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8">
                            Why Choose Healthorate?
                        </h2>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="text-white mt-1">
                                        {feature.icon}
                                    </div>
                                    <span className="text-white text-sm md:text-base font-medium">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Image */}
                    <div className="lg:w-1/2 h-[300px] lg:h-auto">
                        <img
                            src="/src/assets/images/lab.jpg"
                            alt="Lab Microscope"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;                                                    