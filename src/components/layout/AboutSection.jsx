const AboutSection = () => {
    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl">
                    
                    {/* Left - Image */}
                    <div className="lg:w-1/2 h-[300px] lg:h-auto">
                        <img
                            src="/src/assets/images/whoweare.jpg"
                            alt="Healthcare Professional"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right - Content */}
                    <div className="lg:w-1/2 bg-[#1e3a5f] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            About Healthorate
                        </h2>

                        <div className="space-y-4 text-gray-200 text-sm md:text-base leading-relaxed mt-4 text-base">
                            <p>
                                Healthorate is India's fastest-growing AI-powered digital 
                                healthcare platform, revolutionizing how pathology labs 
                                connect with patients and how individuals access 
                                diagnostic services.
                            </p>

                            <p>
                                With a strong emphasis on innovation, accessibility, and 
                                trust, Healthorate offers a seamless digital interface that 
                                allows users to compare diagnostic test prices based on 
                                their location to make informed and cost-effective 
                                healthcare decisions.
                            </p>

                            <p>
                                At Healthorate, we understand the importance of cost-effective 
                                healthcare solutions. Our platform enables customers to access 
                                transparent and reliable information on pathology costs, 
                                empowering them to make informed decisions for their health.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;