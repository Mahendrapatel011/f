import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext';
import { Button, FilterSidebar, SortSidebar, SearchBar, BannerSection, PathologyCard, Pagination } from '../../components/common';
import { useCart } from '../../context/CartContext';
import { HiOutlineX } from 'react-icons/hi';

const PathologyListing = () => {
    const navigate = useNavigate();
    const { location } = useLocationContext();
    const { addToCart } = useCart();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedSort, setSelectedSort] = useState({});
    const [pathologies, setPathologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dynamicFilters, setDynamicFilters] = useState([]);
    const [dynamicSortOptions, setDynamicSortOptions] = useState([]);

    // For Mobile view modals
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

    // Fetch Filters
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/filters');
                if (res.data.success) {
                    const data = res.data.data;

                    // Left Column Filters
                    const mappedFilters = [
                        { key: 'category', title: 'Specialist', options: data.categories },
                        { key: 'subCategory', title: 'Test Type', options: data.testTypes },
                        { key: 'labType', title: 'Pathology Type', options: data.labTypes },
                        { key: 'homeCollection', title: 'Home Collection', options: [{ label: 'Available', value: 'true' }] },
                    ];
                    setDynamicFilters(mappedFilters);

                    // Right Column (Sort + Certs/Timing)
                    const mappedSorts = [
                        {
                            key: 'sort',
                            title: 'Sort By',
                            options: [
                                { label: 'Price: Low to High', value: 'price_low_to_high' },
                                { label: 'Price: High to Low', value: 'price_high_to_low' },
                                { label: 'Highest Rated', value: 'rating_highest' },
                            ]
                        },
                        {
                            key: 'is24x7',
                            title: 'Timing',
                            options: [
                                { label: 'Anytime', value: '' },
                                { label: '24x7 Available', value: 'true' }
                            ]
                        },
                        {
                            key: 'certifications',
                            title: 'Certifications',
                            options: [
                                { label: 'All', value: '' },
                                ...data.certifications
                            ]
                        },
                        {
                            key: 'rating',
                            title: 'Minimum Rating',
                            options: [
                                { label: 'Any', value: '' },
                                { label: '4+ Stars', value: '4' },
                                { label: '3+ Stars', value: '3' },
                            ]
                        }
                    ];
                    setDynamicSortOptions(mappedSorts);
                }
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };
        fetchFilters();
    }, []);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(pathologies.length / itemsPerPage);
    const paginatedPathologies = pathologies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Initial sortOptions removed, using dynamicSortOptions instead

    useEffect(() => {
        const fetchLabs = async () => {
            setLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams();
                if (location?.pincode) params.append('pincode', location.pincode);
                if (searchQuery) params.append('search', searchQuery);

                // Add filters
                Object.entries(selectedFilters).forEach(([key, values]) => {
                    if (values && values.length > 0) {
                        params.append(key, values.join(','));
                    }
                });

                // Add sort
                Object.entries(selectedSort).forEach(([key, value]) => {
                    if (value) params.append(key, value);
                });

                const res = await axios.get(`http://localhost:5000/api/public/labs?${params.toString()}`);

                if (res.data.success) {
                    // Map backend data to frontend card format
                    const mappedData = res.data.data.map(test => {
                        let imageUrl = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600';
                        if (test.images && test.images.length > 0) {
                            const firstImg = test.images[0];
                            imageUrl = firstImg.startsWith('http') ? firstImg : `http://localhost:5000/${firstImg.startsWith('/') ? firstImg.slice(1) : firstImg}`;
                        } else if (test.businessLogo) {
                            imageUrl = test.businessLogo.startsWith('http') ? test.businessLogo : `http://localhost:5000/${test.businessLogo.startsWith('/') ? test.businessLogo.slice(1) : test.businessLogo}`;
                        }

                        return {
                            id: test._id,
                            labId: test.businessId,
                            image: imageUrl,
                            name: test.businessName, // The Lab Name
                            testName: test.name,     // Specifically this test's name
                            price: test.price || 0,
                            originalPrice: null,
                            discount: null,
                            rating: test.rating,
                            reviews: test.reviews,
                            offer: test.offer,
                            subCategories: test.subCategories,
                            homeCollection: test.homeCollection,
                            is24x7: test.is24x7,
                            labType: test.labType
                        };
                    });
                    setPathologies(mappedData);
                }
            } catch (error) {
                console.error('Error fetching labs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, [currentPage, location, searchQuery, selectedFilters, selectedSort]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedFilters, selectedSort, location]);

    const handleVoiceSearch = () => {
        console.log('Voice search activated');
    };

    const handleFilterChange = (filterKey, values) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: values
        }));
    };

    const handleSortChange = (sortKey, value) => {
        setSelectedSort(prev => ({
            ...prev,
            [sortKey]: value
        }));
    };

    const handleApplyFilters = () => {
        console.log('Applying filters:', selectedFilters);
    };

    const handleApplySort = () => {
        console.log('Applying sort:', selectedSort);
    };

    const handleAddToCart = (pathology) => {
        addToCart(pathology.id);
    };

    const handleBookNow = async (item) => {
        // Add to cart and navigate to cart page
        await addToCart(item.id);
        navigate('/cart');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResetAll = () => {
        setSelectedFilters({});
        setSelectedSort({});
        setSearchQuery('');
    };

    const isFilterActive = Object.values(selectedFilters).some(v => v.length > 0) ||
        Object.values(selectedSort).some(v => v !== '' && v !== undefined) ||
        searchQuery.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Bar Section */}
            <div className="bg-white  py-4 sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <SearchBar
                        placeholder="Search by name / location"
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        onVoiceSearch={handleVoiceSearch}
                    />
                </div>
            </div>

            <div className="mt-6">
                <BannerSection />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - Filters */}
                    <div className="w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={dynamicFilters}
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                                onApply={handleApplyFilters}
                            />
                        </div>
                    </div>

                    {/* Main Content - Pathology Cards */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f] mb-4"></div>
                                <p className="text-gray-500 font-medium">Fetching best labs for you...</p>
                            </div>
                        ) : pathologies.length > 0 ? (
                            <>
                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    {paginatedPathologies.map((pathology) => (
                                        <div key={pathology.id} className="animate-fadeIn">
                                            <PathologyCard
                                                id={pathology.id}
                                                labId={pathology.labId}
                                                image={pathology.image}
                                                name={pathology.name}
                                                testName={pathology.testName}
                                                price={pathology.price}
                                                originalPrice={pathology.originalPrice}
                                                discount={pathology.discount}
                                                rating={pathology.rating}
                                                reviews={pathology.reviews}
                                                offer={pathology.offer}
                                                onAddToCart={() => handleAddToCart(pathology)}
                                                onBookNow={() => handleBookNow(pathology)}
                                                onClick={() => navigate(`/test/${pathology.id}`)}
                                                className="w-full flex-shrink-0"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* End of Results Footer - ONLY show it on the final page */}
                                {(currentPage === totalPages || totalPages <= 1) && (
                                    <div className="flex flex-col items-center justify-center py-12 border-t border-gray-100 mt-8">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-700 mb-1 font-outfit">End of Results</h3>
                                        <p className="text-gray-400 mb-6 text-center text-xs">We couldn't find more results. Try a different search!</p>
                                        <Button
                                            onClick={handleResetAll}
                                            variant="secondary"
                                            size="sm"
                                            className="px-6 rounded-lg"
                                        >
                                            Reset all Filters
                                        </Button>
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                {pathologies.length > itemsPerPage && (
                                    <div className="mt-8 mb-12 pb-10">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            /* EMPTY STATE */
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center animate-fadeIn">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                                        {isFilterActive ? (
                                            <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isFilterActive && (
                                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50">
                                            <HiOutlineX className="text-[#1e3a5f]" size={16} />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-extrabold text-[#1e3a5f] mb-3 font-outfit">
                                    {isFilterActive
                                        ? "Sorry, no matches for your current filters."
                                        : `We're sorry, we aren't currently available at ${location?.city || "this location"}.`}
                                </h2>
                                <p className="text-gray-400 mb-10 max-w-sm text-sm leading-relaxed">
                                    {isFilterActive
                                        ? "Try searching for a different test or reset your filters to explore more health options."
                                        : "We are expanding fast! Sign up to get notified when we launch in your area."}
                                </p>
                                <Button
                                    onClick={handleResetAll}
                                    variant="secondary"
                                    className="px-10 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/10 active:scale-95"
                                >
                                    {isFilterActive ? "Reset all Filters" : "Change Location"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Sort */}
                    <div className="w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <SortSidebar
                                sortOptions={dynamicSortOptions}
                                selectedSort={selectedSort}
                                onSortChange={handleSortChange}
                                onApply={handleApplySort}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter/Sort Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="flex-1 py-3 px-4 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg font-bold bg-white active:bg-blue-50 transition-colors"
                    >
                        Filters
                    </button>
                    <button
                        onClick={() => setIsMobileSortOpen(true)}
                        className="flex-1 py-3 px-4 bg-[#1e3a5f] text-white rounded-lg font-bold shadow-md active:bg-[#2d4a6f] transition-colors"
                    >
                        Sort
                    </button>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[60] bg-white overflow-y-auto lg:hidden flex flex-col">
                    <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
                        <h2 className="text-xl font-bold text-[#1e3a5f]">Filters</h2>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                            <HiOutlineX size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="p-4 pb-20 flex-1 overflow-y-auto">
                        <FilterSidebar
                            filters={dynamicFilters}
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                            onApply={() => {
                                handleApplyFilters();
                                setIsMobileFilterOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Sort Modal */}
            {isMobileSortOpen && (
                <div className="fixed inset-0 z-[60] bg-white overflow-y-auto lg:hidden flex flex-col">
                    <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
                        <h2 className="text-xl font-bold text-[#1e3a5f]">Sort Options</h2>
                        <button onClick={() => setIsMobileSortOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                            <HiOutlineX size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="p-4 pb-20 flex-1 overflow-y-auto">
                        <SortSidebar
                            sortOptions={dynamicSortOptions}
                            selectedSort={selectedSort}
                            onSortChange={handleSortChange}
                            onApply={() => {
                                handleApplySort();
                                setIsMobileSortOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathologyListing;