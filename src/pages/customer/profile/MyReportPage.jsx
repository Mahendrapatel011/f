// pages/profile/MyReportPage.jsx
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import DateRangePicker from '../../../components/common/DateRangePicker';
import FilterButton from '../../../components/common/FilterButton';
import { BookingSection } from '../../../components/bookings';
import ReportDetailsModal from '../../../components/bookings/ReportDetailsModal';
import toast from 'react-hot-toast';

const MyReportPage = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter State
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [filters, setFilters] = useState({ status: 'all' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modal State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load bookings');
                toast.error('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    // Map orders to the format expected by BookingSection
    const mappedBookings = useMemo(() => {
        return orders.map(order => {
            let imageUrl = 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=200';
            if (order.business?.profileImage) {
                const img = order.business.profileImage;
                imageUrl = img.startsWith('http') ? img : `http://localhost:5000/${img.startsWith('/') ? img.slice(1) : img}`;
            }

            return {
                id: order._id,
                bookingId: `#${order._id.slice(-6).toUpperCase()}`,
                pathologyName: order.business?.businessName || 'N/A',
                testName: order.items.map(i => i.name).join(', '),
                date: order.scheduledDate,
                time: order.timeSlot,
                image: imageUrl,
                status: order.orderStatus,
                totalAmount: order.totalAmount
            };
        });
    }, [orders]);

    // Separate recent and upcoming bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { upcomingBookings, recentBookings } = useMemo(() => {
        const upcoming = [];
        const recent = [];

        mappedBookings.forEach(booking => {
            const matchesStatus = filters.status === 'all' || booking.status.toLowerCase() === filters.status.toLowerCase();
            if (!matchesStatus) return;

            const bookingDate = new Date(booking.date);
            const isUpcoming = bookingDate >= today && booking.status !== 'completed' && booking.status !== 'cancelled';

            if (isUpcoming) {
                upcoming.push(booking);
            } else {
                // Apply date filter ONLY to recent/past bookings
                const matchesDate = bookingDate >= new Date(dateRange.startDate) && bookingDate <= new Date(dateRange.endDate);
                if (matchesDate) {
                    recent.push(booking);
                }
            }
        });

        return { upcomingBookings: upcoming, recentBookings: recent };
    }, [mappedBookings, filters.status, dateRange, today]);

    // Handlers
    const handleDateChange = (newDateRange) => {
        setDateRange(newDateRange);
    };

    const handleViewDetails = (booking) => {
        setSelectedOrderId(booking.id);
        setIsReportModalOpen(true);
    };

    const activeFiltersCount = filters.status !== 'all' ? 1 : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-gray-500 text-sm">View and manage your test bookings</p>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Recent</span>
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onDateChange={handleDateChange}
                    />
                </div>

                <FilterButton
                    onClick={() => setIsFilterOpen(true)}
                    activeFiltersCount={activeFiltersCount}
                />
            </div>

            {/* Upcoming Bookings Section */}
            {upcomingBookings.length > 0 ? (
                <BookingSection
                    title="Upcoming"
                    bookings={upcomingBookings}
                    onViewDetails={handleViewDetails}
                    emptyMessage="No upcoming bookings"
                />
            ) : (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-gray-500">No upcoming bookings found</p>
                </div>
            )}

            {/* Recent Bookings Section */}
            {recentBookings.length > 0 && (
                <BookingSection
                    title="Recent/Completed"
                    bookings={recentBookings}
                    onViewDetails={handleViewDetails}
                    emptyMessage="No recent bookings"
                />
            )}

            {/* Report Details Modal */}
            <ReportDetailsModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                orderId={selectedOrderId}
            />
        </div>
    );
};

export default MyReportPage;