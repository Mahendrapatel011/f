import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PathologyCard from './PathologyCard';

const PathologyCarousel = ({ title = "Continue Exploring", items = [] }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 300; // Approx card width + gap
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="py-8">
            {title && (
                <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
            )}

            <div className="relative group">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
                >
                    <FaChevronLeft className="w-4 h-4 ml-[-2px]" />
                </button>

                {/* Cards Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {items.map((item, index) => (
                        <PathologyCard
                            key={index}
                            {...item}
                            // Ensure image prop is passed correctly; if item has 'images' array, use first one
                            image={item.image || (item.images && item.images[0])}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                    <FaChevronRight className="w-4 h-4 mr-[-2px]" />
                </button>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default PathologyCarousel;
