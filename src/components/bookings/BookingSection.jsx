// components/bookings/BookingSection.jsx
import BookingCard from './BookingCard';

const BookingSection = ({ 
    title, 
    bookings = [], 
    onViewDetails,
    emptyMessage = 'No bookings found',
    className = '' 
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Section Title */}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {/* Booking Cards */}
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    {emptyMessage}
                </div>
            )}
        </div>
    );
};

export default BookingSection;