const BrandsSection = () => {
    const brands = [
        {
            id: 1,
            name: 'Dr Lal PathLabs',
            logo: '/src/assets/images/brand/1.png'
        },
        {
            id: 2,
            name: 'Pathkind Labs',
            logo: '/src/assets/images/brand/2.png'
        },
        {
            id: 3,
            name: 'SRL Diagnostics',
            logo: '/src/assets/images/brand/3.png'
        },
        {
            id: 4,
            name: 'Metropolis',
            logo: '/src/assets/images/brand/4.png'
        },
        {
            id: 5,
            name: 'Apollo Diagnostics',
            logo: '/src/assets/images/brand/5.png'
        },
        {
            id: 6,
            name: 'Lucid Diagnostics',
            logo: '/src/assets/images/brand/6.png'
        },
       
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Brands We Stand Behind
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Trusted by millions, delivered to you through the best lab brands
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
                    {brands.map((brand) => (
                        <div 
                            key={brand.id} 
                            className="w-[140px] md:w-[160px] h-[60px] md:h-[70px] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BrandsSection;