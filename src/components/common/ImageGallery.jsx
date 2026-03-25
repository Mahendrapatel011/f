import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from 'react-icons/fa';

const ImageGallery = ({
    images = [],
    discount = null,
    offer = null,
    onWishlist,
    isWishlisted = false
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wishlisted, setWishlisted] = useState(isWishlisted);

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleWishlist = () => {
        setWishlisted(!wishlisted);
        onWishlist && onWishlist(!wishlisted);
    };

    return (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100">
            {/* Main Image */}
            <div className="aspect-[4/3] relative">
                <img
                    src={images[currentIndex] || 'https://via.placeholder.com/400x300'}
                    alt={`Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* Discount Badge - FIXED */}
                {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
                        {discount}% OFF
                    </span>
                )}

                {/* Offer Badge (Top Right) */}
                {offer && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded shadow-sm border border-green-400 z-10">
                        {offer.title}
                    </span>
                )}



                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <FaChevronLeft className="text-gray-600 w-3 h-3" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <FaChevronRight className="text-gray-600 w-3 h-3" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;