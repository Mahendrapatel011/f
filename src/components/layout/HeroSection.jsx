import { Link } from 'react-router-dom';
import { Button } from '../common';

const HeroSection = () => {
    return (
        <section className="bg-white py-8 md:py-12">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            India's First
                        </h1>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mt-1">
                            Healthcare Platform
                        </h1>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mt-1">
                            Where
                        </h1>

                        <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm">
                            AI Meets Healthcare & Save
                            <br />
                            Money on Every Test
                        </p>

                        <div className="mt-6">
                            <Link to="/book-test">
                                <Button variant="secondary" size="md">
                                    Book a Test Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Image - SMALLER SIZE */}
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px]">
                            {/* Background Shape */}
                            <div className="absolute top-0 right-0 w-full h-full bg-[#c9f5f5] rounded-tl-[20px] rounded-tr-[60px] rounded-bl-[60px] rounded-br-[20px]"></div>

                            {/* Hero Image */}
                            <img
                                src="/src/assets/images/HeroImage.png"
                                alt="Healthcare Professionals"
                                className="absolute top-2 left-2 w-[95%] h-[95%] object-cover rounded-tl-[20px] rounded-tr-[60px] rounded-bl-[60px] rounded-br-[20px]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;