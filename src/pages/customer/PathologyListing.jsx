import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext';
import PathologyCard from '../../components/common/PathologyCard';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import FilterSidebar from '../../components/common/FilterSidebar';
import SortSidebar from '../../components/common/SortSidebar';

const PathologyListing = () => {
    const navigate = useNavigate();
    const { location } = useLocationContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedSort, setSelectedSort] = useState({});
    const [pathologies, setPathologies] = useState([]);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 4;
    const totalPages = 10; // TODO: Get from backend

    // Filter options
    const filters = [
        {
            key: 'specialist',
            title: 'Specialist',
            options: [
                { label: 'General', value: 'general' },
                { label: 'Cardiology', value: 'cardiology' },
                { label: 'Neurology', value: 'neurology' },
                { label: 'Orthopedics', value: 'orthopedics' },
            ]
        },
        {
            key: 'testType',
            title: 'Test Type',
            options: [
                { label: 'Blood Test', value: 'blood' },
                { label: 'Urine Test', value: 'urine' },
                { label: 'X-Ray', value: 'xray' },
                { label: 'MRI', value: 'mri' },
                { label: 'CT Scan', value: 'ct_scan' },
            ]
        },
        {
            key: 'pathologyType',
            title: 'Pathology Type',
            options: [
                { label: 'Diagnostic Center', value: 'diagnostic' },
                { label: 'Hospital Lab', value: 'hospital' },
                { label: 'Private Lab', value: 'private' },
            ]
        },
        {
            key: 'homeCollection',
            title: 'Home Collection',
            options: [
                { label: 'Available', value: 'available' },
                { label: 'Not Available', value: 'not_available' },
            ]
        },
        {
            key: 'timing',
            title: 'Timing',
            options: [
                { label: '24x7', value: '24x7' },
                { label: 'Morning (6AM - 12PM)', value: 'morning' },
                { label: 'Afternoon (12PM - 6PM)', value: 'afternoon' },
                { label: 'Evening (6PM - 10PM)', value: 'evening' },
            ]
        },
    ];

    // Sort options
    const sortOptions = [
        {
            key: 'certification',
            title: 'Certification',
            options: [
                { label: 'NABL Certified', value: 'nabl' },
                { label: 'ISO Certified', value: 'iso' },
                { label: 'NABH Certified', value: 'nabh' },
            ]
        },
        {
            key: 'reviews',
            title: 'Reviews',
            options: [
                { label: 'Most Reviews', value: 'most' },
                { label: 'Highest Rated', value: 'highest' },
            ]
        },
        {
            key: 'price',
            title: 'Price',
            options: [
                { label: 'Low to High', value: 'low_to_high' },
                { label: 'High to Low', value: 'high_to_low' },
            ]
        },
        {
            key: 'rating',
            title: 'Rating',
            options: [
                { label: '4+ Stars', value: '4plus' },
                { label: '3+ Stars', value: '3plus' },
                { label: '2+ Stars', value: '2plus' },
            ]
        },
    ];

    useEffect(() => {
        const fetchLabs = async () => {
            setLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams();
                if (location?.pincode) params.append('pincode', location.pincode);
                if (searchQuery) params.append('search', searchQuery);

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
                            subCategories: test.subCategories // Pass subcats if card needs them
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
        setCurrentPage(1);
    };

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
        setCurrentPage(1);
    };

    const handleApplySort = () => {
        console.log('Applying sort:', selectedSort);
    };

    const handleAddToCart = (pathology) => {
        console.log('Added to cart:', pathology);
    };

    const handleBookNow = (item) => {
        // Navigate to the test detail page
        navigate(`/test/${item.id}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - Filters */}
                    <div className="w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={filters}
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                                onApply={handleApplyFilters}
                            />
                        </div>
                    </div>

                    {/* Main Content - Pathology Cards */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
                            </div>
                        ) : (
                            <>
                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                                    {pathologies.length > 0 ? (
                                        pathologies.map((pathology) => (
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
                                                onAddToCart={() => handleAddToCart(pathology)}
                                                onBookNow={() => handleBookNow(pathology)}
                                                onClick={() => handleBookNow(pathology)}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-10">
                                            <p className="text-gray-500">No labs found for "<strong>{location?.pincode}</strong>". Try changing location.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Sidebar - Sort */}
                    <div className="w-64 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24">
                            <SortSidebar
                                sortOptions={sortOptions}
                                selectedSort={selectedSort}
                                onSortChange={handleSortChange}
                                onApply={handleApplySort}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter/Sort Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
                <div className="flex gap-4">
                    <button className="flex-1 py-2 px-4 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg font-medium">
                        Filters
                    </button>
                    <button className="flex-1 py-2 px-4 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg font-medium">
                        Sort
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PathologyListing;