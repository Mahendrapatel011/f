import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaClock, FaUserMd, FaFlask, FaStar, FaSearch, FaChevronDown, FaRegStar } from 'react-icons/fa';
import { Footer } from '../../components/layout';
import { Button, Rating, Badge, ReviewCard, ImageGallery, PathologyCarousel } from '../../components/common';

import axios from 'axios';

const LabDetail = () => {
    const { id } = useParams();
    const routerLocation = useLocation();
    const isTestPage = routerLocation.pathname.includes('/test/');

    const [labData, setLabData] = useState(null);
    const [similarTests, setSimilarTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllTests, setShowAllTests] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = isTestPage
                    ? `http://localhost:5000/api/public/tests/${id}`
                    : `http://localhost:5000/api/public/labs/${id}`;

                const res = await axios.get(endpoint);

                if (res.data.success) {
                    const data = res.data.data;

                    const formatImageUrl = (imagePath) => {
                        if (!imagePath) return null;
                        if (imagePath.startsWith('http')) return imagePath;
                        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
                        return `http://localhost:5000${cleanPath}`;
                    };

                    if (isTestPage) {
                        // Fetch similar tests if it's a test page
                        try {
                            const simRes = await axios.get(`http://localhost:5000/api/public/tests/${id}/similar`);
                            if (simRes.data.success) {
                                setSimilarTests(simRes.data.data.map(t => ({
                                    ...t,
                                    image: formatImageUrl(t.image)
                                })));
                            }
                        } catch (simErr) {
                            console.error('Error fetching similar tests:', simErr);
                        }

                        // Handle single test data
                        const test = data;
                        const lab = test.business;


                        const allImages = [
                            ...(test.images || []),

                        ].filter(Boolean).map(formatImageUrl);

                        setLabData({
                            id: test._id,
                            name: lab.businessName,
                            rating: lab.rating,
                            reviews: lab.reviews,
                            priceMin: test.price,
                            priceMax: test.price,
                            discount: 0,
                            note: '*Pick & Drop charges vary as per the location KMs.',
                            images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'],
                            testName: test.name,
                            testInstructions: test.preparation || 'Please check individual test instructions.',
                            owner: {
                                name: lab.ownerName || 'Lab Owner',
                                experience: lab.yearsOfExperience || 'N/A'
                            },
                            testsOffered: [{
                                name: test.name,
                                subCategories: test.subCategories?.map(sc => sc.name) || []
                            }],
                            workingHours: lab.workingHours ?
                                lab.workingHours.reduce((acc, curr) => ({ ...acc, [curr.day]: `${curr.openingTime} - ${curr.closingTime}` }), {})
                                : {},
                            reviewsList: []
                        });
                    } else {
                        // Handle full lab data
                        const { lab, tests } = data;
                        const allImages = [
                            lab.profileImage,
                            ...tests.flatMap(t => t.images || [])
                        ].filter(Boolean).map(formatImageUrl);

                        const prices = tests.map(t => t.price);
                        setLabData({
                            id: lab._id,
                            name: lab.businessName,
                            rating: lab.rating,
                            reviews: lab.reviews,
                            priceMin: tests.length > 0 ? Math.min(...prices) : 0,
                            priceMax: tests.length > 0 ? Math.max(...prices) : 0,
                            discount: 0,
                            note: '*Pick & Drop charges vary as per the location KMs.',
                            images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'],
                            testName: 'Available Tests',
                            testInstructions: 'Please check individual test instructions.',
                            owner: {
                                name: lab.ownerName || 'Lab Owner',
                                experience: lab.yearsOfExperience || 'N/A'
                            },
                            testsOffered: tests.map(t => ({
                                name: t.name,
                                subCategories: t.subCategories?.map(sc => sc.name) || []
                            })),
                            workingHours: lab.workingHours ?
                                lab.workingHours.reduce((acc, curr) => ({ ...acc, [curr.day]: `${curr.openingTime} - ${curr.closingTime}` }), {})
                                : {},
                            reviewsList: []
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, isTestPage]);

    const handleAddToCart = () => {
        console.log('Add to cart:', labData.id);
    };

    const handleBookNow = () => {
        console.log('Book now:', labData.id);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    if (!labData) {
        return <div className="min-h-screen flex items-center justify-center">Lab not found</div>;
    }

    const displayedReviews = showAllReviews ? labData.reviewsList : labData.reviewsList.slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 py-6 md:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 md:p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                            {/* Left - Image Gallery */}
                            <div>
                                <ImageGallery
                                    images={labData.images}
                                    discount={labData.discount}
                                    onWishlist={(status) => console.log('Wishlist:', status)}
                                />
                                <div className="flex gap-4 mt-6">
                                    <Button variant="outline" size="md" onClick={handleAddToCart} className="flex-1">Add to Cart</Button>
                                    <Button variant="secondary" size="md" onClick={handleBookNow} className="flex-1">Book Now</Button>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaClock className="text-gray-600 w-4 h-4" />
                                        <h3 className="font-semibold text-gray-800">Working Hours:</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(labData.workingHours).map(([day, time]) => (
                                            <div key={day} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{day}:</span>
                                                <span className="text-blue-600 font-medium">{time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right - Details */}
                            <div>
                                <div className="mb-4">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 italic mb-2">{labData.name}</h1>
                                    <Rating rating={labData.rating} reviews={labData.reviews} size="md" />
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-[#1e3a5f]">₹{labData.priceMin.toLocaleString()}</span>
                                        {labData.priceMax > labData.priceMin && (
                                            <>
                                                <span className="text-gray-400">-</span>
                                                <span className="text-lg text-gray-400 line-through">₹{labData.priceMax.toLocaleString()}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{labData.note}</p>
                                </div>
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h2 className="font-bold text-gray-900 mb-2">{labData.testName}</h2>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Instructions:</span><br />
                                        {labData.testInstructions}
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-100">
                                    <FaUserMd className="text-gray-400 w-5 h-5 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Owner & Experience</h3>
                                        <p className="text-gray-600 text-sm">{labData.owner.name}, {labData.owner.experience}</p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="relative">
                                            <FaFlask className="text-gray-900 w-5 h-5" />
                                            <FaSearch className="text-gray-900 w-3 h-3 absolute -bottom-1 -right-2 bg-white rounded-full" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg ml-1">Test Offered:</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(showAllTests ?
                                            labData.testsOffered.flatMap(t => t.subCategories.length > 0 ? t.subCategories : [t.name]) :
                                            labData.testsOffered.flatMap(t => t.subCategories.length > 0 ? t.subCategories : [t.name]).slice(0, 6)
                                        ).map((item, index) => (
                                            <div key={index} className="bg-[#eaf2ff] text-[#3482f6] rounded-full py-1.5 px-5 text-sm font-medium border border-blue-100 flex items-center justify-center">
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    {labData.testsOffered.flatMap(t => t.subCategories.length > 0 ? t.subCategories : [t.name]).length > 6 && (
                                        <div className="flex justify-center mt-4">
                                            <button onClick={() => setShowAllTests(!showAllTests)} className="text-gray-500 text-xs flex items-center gap-1 hover:text-gray-800 transition-colors font-medium">
                                                {showAllTests ? 'Show less' : 'Show more'}
                                                <FaChevronDown className={`w-3 h-3 transition-transform ${showAllTests ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <FaRegStar className="text-gray-900 w-5 h-5 font-bold" strokeWidth={2} />
                                <h2 className="text-lg font-bold text-gray-900">Reviews ({labData.reviewsList.length})</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                {displayedReviews.map((review) => (
                                    <ReviewCard key={review.id} username={review.username} date={review.date} rating={review.rating} review={review.review} />
                                ))}
                            </div>
                        </div>

                        {/* Continue Exploring Section */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Continue Exploring</h2>
                                <p className="text-gray-500 text-sm mt-1">Recommended tests in your category and area</p>
                            </div>
                            {similarTests.length > 0 ? (
                                <PathologyCarousel items={similarTests} />
                            ) : (
                                <p className="text-gray-500 italic text-center py-8">No other similar tests found in your area.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LabDetail;