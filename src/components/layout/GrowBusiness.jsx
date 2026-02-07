const GrowBusiness = () => {
    const features = [
        {
            id: 1,
            image: '/src/assets/images/G1.png',
            title: 'Market Your Business to New Users'
        },
        {
            id: 2,
            image: '/src/assets/images/G2.png',
            title: 'Grow Your Revenue'
        },
        {
            id: 3,
            image: '/src/assets/images/G3.png',
            title: 'Get More Walk-in Customers'
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Grow Your Business
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Advertise for free with Healthorate Ads and reach your goals effortlessly.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {features.map((item) => (
                        <div key={item.id} className="text-center">
                            {/* Image */}
                            <div className="h-[180px] md:h-[200px] flex items-center justify-center mb-6">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-auto object-contain"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-base md:text-lg font-bold text-gray-900">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default GrowBusiness;