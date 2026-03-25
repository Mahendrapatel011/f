import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocationContext } from '../../context/LocationContext';

const BannerSection = () => {
    const { location } = useLocationContext();
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                let url = 'http://localhost:5000/api/public/banners';
                if (location?.pincode) {
                    url += `?pincode=${location.pincode}`;
                }
                const res = await axios.get(url);
                if (res.data.success) {
                    setBanners(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [location?.pincode]);

    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    if (loading) return null;
    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];
    const normalizedImage = currentBanner.image.replace(/\\/g, '/');
    const imagePath = normalizedImage.startsWith('http')
        ? normalizedImage
        : `http://localhost:5000/${normalizedImage.replace('uploads/banners/', 'uploads/')}`;

    return (
        <div className="container mx-auto px-4 mb-6 mt-4">
            <div className="relative w-full h-28 md:h-40 lg:h-52 overflow-hidden rounded-2xl shadow-lg group">
                {/* Banner Content */}
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out transform scale-100"
                    style={{ backgroundImage: `url("${imagePath}")` }}
                >
                    {/* Overlay for text if needed, but usually banners are pre-designed images */}
                    {/* {currentBanner.title && (
                        <div className="absolute inset-0 bg-black/20 flex items-center px-8 md:px-16">
                            <h2 className="text-white text-2xl md:text-4xl font-bold max-w-lg leading-tight">
                                {currentBanner.title}
                            </h2>
                        </div>
                    )} */}
                </div>

                {/* Navigation Dots */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Optional: Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1))}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BannerSection;
