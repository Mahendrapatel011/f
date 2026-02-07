import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PathologyCard } from '../common';

// Dummy Data with Unsplash Images
const dummyPathologies = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1579152276503-34e85741f237?auto=format&fit=crop&q=80&w=600',
        name: 'Pradeep Pathology',
        testName: 'CBC Test',
        price: 3000,
        originalPrice: 5000,
        discount: 25,
        rating: 3.5,
        reviews: 76
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
        name: 'City Diagnostics',
        testName: 'CBC Test',
        price: 3000,
        originalPrice: 5000,
        discount: 25,
        rating: 3.5,
        reviews: 76
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1579152276503-34e85741f237?auto=format&fit=crop&q=80&w=600',
        name: 'Arogyam Centre',
        testName: 'CBC Test',
        price: 3000,
        originalPrice: 5000,
        discount: 25,
        rating: 3.5,
        reviews: 76
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
        name: 'LifeCare Labs',
        testName: 'Blood Test',
        price: 2500,
        originalPrice: 4000,
        discount: 30,
        rating: 4.2,
        reviews: 120
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600',
        name: 'MedTest Diagnostics',
        testName: 'Thyroid Test',
        price: 1800,
        originalPrice: 2500,
        discount: 20,
        rating: 4.0,
        reviews: 95
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
        name: 'Health First Lab',
        testName: 'Lipid Profile',
        price: 2200,
        originalPrice: 3500,
        discount: 35,
        rating: 4.5,
        reviews: 200
    }
];

const TopPathologies = () => {
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

    const handleAddToCart = (id) => {
        console.log('Add to cart:', id);
    };

    const handleBookNow = (id) => {
        console.log('Book now:', id);
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Top Pathologies Near You
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        Discover trusted pathology labs in your area with verified ratings and reviews
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">

                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        <FaChevronLeft className="text-gray-600 w-4 h-4" />
                    </button>

                    {/* Cards Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {dummyPathologies.map((pathology) => (
                            <PathologyCard
                                key={pathology.id}
                                image={pathology.image}
                                name={pathology.name}
                                testName={pathology.testName}
                                price={pathology.price}
                                originalPrice={pathology.originalPrice}
                                discount={pathology.discount}
                                rating={pathology.rating}
                                reviews={pathology.reviews}
                                onAddToCart={() => handleAddToCart(pathology.id)}
                                onBookNow={() => handleBookNow(pathology.id)}
                            />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        <FaChevronRight className="text-gray-600 w-4 h-4" />
                    </button>

                </div>

            </div>
        </section>
    );
};

export default TopPathologies;