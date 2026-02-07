import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '../common';

// Dummy Data - Baad mein backend se aayega
const dummyTests = [
    {
        id: 1,
        name: 'Malaria Test',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400'
    },
    {
        id: 2,
        name: 'BP Test',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
    },
    {
        id: 3,
        name: 'CT Scan',
        image: 'https://images.unsplash.com/photo-1516069677018-378515003435?w=400'
    },
    {
        id: 4,
        name: 'Blood Test',
        image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400'
    },
    {
        id: 5,
        name: 'X-Ray',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400'
    },
    {
        id: 6,
        name: 'MRI Scan',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400'
    },
    {
        id: 7,
        name: 'Thyroid Test',
        image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=400'
    },
    {
        id: 8,
        name: 'Diabetes Test',
        image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400'
    }
];

const TopTests = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleBookNow = (testId) => {
        console.log('Book test:', testId);
        // Navigate to booking page
    };

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Top Tests
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Search & book from over 10,000+ pathology tests
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-[#1e3a5f] rounded-full shadow-lg flex items-center justify-center hover:bg-[#2d4a6f] transition-colors"
                    >
                        <FaChevronLeft className="text-white w-4 h-4" />
                    </button>

                    {/* Cards Container */}
                    <div 
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {dummyTests.map((test) => (
                            <TestCard
                                key={test.id}
                                test={test}
                                onBookNow={() => handleBookNow(test.id)}
                            />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-[#1e3a5f] rounded-full shadow-lg flex items-center justify-center hover:bg-[#2d4a6f] transition-colors"
                    >
                        <FaChevronRight className="text-white w-4 h-4" />
                    </button>

                </div>

            </div>
        </section>
    );
};

// Test Card Component
const TestCard = ({ test, onBookNow }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-[220px] flex-shrink-0 border border-gray-100 hover:shadow-lg transition-shadow p-4">
            {/* Image */}
            <div className="h-[150px] rounded-xl overflow-hidden mb-4">
                <img
                    src={test.image}
                    alt={test.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Test Name */}
            <h3 className="font-semibold text-gray-900 text-base mb-3">
                {test.name}
            </h3>

            {/* Book Now Button */}
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={onBookNow}
                className="w-full"
            >
                Book Now
            </Button>
        </div>
    );
};

export default TopTests;