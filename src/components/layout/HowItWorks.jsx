const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            image: '/src/assets/images/H1.png',
            step: 'Step 1',
            title: 'Login to Your Account',
            description: 'Login using your email or phone number to access personalized pathology services and track all your health bookings.'
        },
        {
            id: 2,
            image: '/src/assets/images/H2.png',
            step: 'Step 2',
            title: 'Select & Book a Test',
            description: 'Choose your test, compare nearby lab prices, and confirm your booking—all from your user-friendly homepage.'
        },
        {
            id: 3,
            image: '/src/assets/images/H3.png',
            step: 'Step 3',
            title: 'Make Payment',
            description: 'Make secure payments through the platform and get an instant digital receipt.'
        }
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        How It Works
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Easy steps, quick results - book your health tests now
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {steps.map((item) => (
                        <div key={item.id} className="text-center md:text-left">
                            {/* Image */}
                            <div className="h-[200px] md:h-[220px] flex items-center justify-center mb-6">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-auto object-contain"
                                />
                            </div>

                            {/* Step Number */}
                            <p className="text-gray-400 text-sm font-medium mb-1">
                                {item.step}
                            </p>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;