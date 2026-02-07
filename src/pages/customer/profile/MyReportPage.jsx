// pages/profile/MyReportPage.jsx
import { useState, useMemo } from 'react';
import DateRangePicker from '../../../components/common/DateRangePicker';
import FilterButton from '../../../components/common/FilterButton';
import { BookingSection } from '../../../components/bookings';

const MyReportPage = () => {
    // State
    const [dateRange, setDateRange] = useState({
        startDate: '2025-04-01',
        endDate: '2025-05-01'
    });
    const [filters, setFilters] = useState({ status: 'all' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Mock Data
    const allBookings = [
        {
            id: 1,
            bookingId: '#OA234Q005',
            pathologyName: 'Pathology Name',
            testName: 'CBC Test',
            date: '2025-05-25',
            time: '9:00AM',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200',
            status: 'cancelled'
        },
        {
            id: 2,
            bookingId: '#OA234Q005',
            pathologyName: 'Pathology Name',
            testName: 'CBC Test',
            date: '2025-05-25',
            time: '9:00AM',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200',
            status: 'done'
        },
        {
            id: 3,
            bookingId: '#OA234Q005',
            pathologyName: 'Pathology Name',
            testName: 'CBC Test',
            date: '2025-06-15',
            time: '9:00AM',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200',
            status: 'pending'
        },
        {
            id: 4,
            bookingId: '#OA234Q006',
            pathologyName: 'City Diagnostics',
            testName: 'Blood Sugar Test',
            date: '2025-06-20',
            time: '10:30AM',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200',
            status: 'confirmed'
        }
    ];

    // Filter bookings based on status
    const filteredBookings = useMemo(() => {
        if (filters.status === 'all') return allBookings;
        return allBookings.filter(booking =>
            booking.status.toLowerCase() === filters.status.toLowerCase()
        );
    }, [filters.status, allBookings]);

    // Separate recent and upcoming bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate < today || booking.status === 'done' || booking.status === 'cancelled';
    });

    const upcomingBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= today && booking.status !== 'done' && booking.status !== 'cancelled';
    });

    // Handlers
    const handleDateChange = (newDateRange) => {
        setDateRange(newDateRange);
        console.log('Date range changed:', newDateRange);
    };

    const handleViewDetails = (booking) => {
        console.log('View details for:', booking);
        // Navigate to booking details page or open modal
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const activeFiltersCount = filters.status !== 'all' ? 1 : 0;

    return (
        <div className="space-y-6">
            {/* Page Description */}
            <p className="text-gray-500 text-sm">View and manage your test bookings</p>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Recent Label & Date Range */}
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Recent</span>
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onDateChange={handleDateChange}
                    />
                </div>

                {/* Filter Button */}
                <FilterButton
                    onClick={() => setIsFilterOpen(true)}
                    activeFiltersCount={activeFiltersCount}
                />
            </div>

            {/* Recent Bookings Section */}
            {recentBookings.length > 0 && (
                <BookingSection
                    title=""
                    bookings={recentBookings}
                    onViewDetails={handleViewDetails}
                    emptyMessage="No recent bookings"
                />
            )}

            {/* Upcoming Bookings Section */}
            <BookingSection
                title="Upcoming"
                bookings={upcomingBookings}
                onViewDetails={handleViewDetails}
                emptyMessage="No upcoming bookings"
            />

            {/* Filter Modal - TODO: Create BookingFilters component */}
            {/* <BookingFilters
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
            /> */}
        </div>
    );
};

export default MyReportPage;