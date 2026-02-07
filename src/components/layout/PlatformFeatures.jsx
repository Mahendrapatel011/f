import { 
    FaUserPlus, 
    FaClipboardList, 
    FaShieldAlt, 
    FaStar, 
    FaHeadset,
    FaRocket,
    FaMobileAlt,
    FaBell,
    FaChartLine,
    FaCreditCard
} from 'react-icons/fa';

const PlatformFeatures = () => {
    const features = [
        {
            id: 1,
            icon: <FaUserPlus />,
            title: 'Zero-Patient Acquisition Cost'
        },
        {
            id: 2,
            icon: <FaClipboardList />,
            title: 'AI-Powered Visibility'
        },
        {
            id: 3,
            icon: <FaShieldAlt />,
            title: '100% Transparent & Trusted'
        },
        {
            id: 4,
            icon: <FaStar />,
            title: 'Free Premium Listing'
        },
        {
            id: 5,
            icon: <FaHeadset />,
            title: '24/7 Customer Support'
        },
        {
            id: 6,
            icon: <FaRocket />,
            title: 'Build Your Brand Online'
        },
        {
            id: 7,
            icon: <FaMobileAlt />,
            title: 'No Integration Hassle'
        },
        {
            id: 8,
            icon: <FaBell />,
            title: 'Real-Time Lead Alerts'
        },
        {
            id: 9,
            icon: <FaChartLine />,
            title: 'Grow Your Revenue'
        },
        {
            id: 10,
            icon: <FaCreditCard />,
            title: 'Seamless Payment Solution'
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Platform Features
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Discover the features that make Healthorate your trusted health partner
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {features.map((feature) => (
                        <div 
                            key={feature.id} 
                            className="bg-gray-50 rounded-xl p-4 md:p-6 text-center hover:shadow-md transition-shadow border border-gray-100"
                        >
                            {/* Icon */}
                            <div className="text-3xl md:text-4xl text-gray-700 mb-3 flex justify-center">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xs md:text-sm font-semibold text-gray-700 leading-tight">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PlatformFeatures;