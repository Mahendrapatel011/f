// components/bookings/BookingCard.jsx
import Button from '../common/Button';

const BookingCard = ({ 
    booking, 
    onViewDetails,
    className = '' 
}) => {
    const { 
        id, 
        bookingId, 
        pathologyName, 
        testName, 
        date, 
        time, 
        image, 
        status 
    } = booking;

    const statusConfig = {
        cancelled: {
            color: 'text-red-500',
            bgColor: 'bg-red-500',
            label: 'Cancelled'
        },
        done: {
            color: 'text-green-500',
            bgColor: 'bg-green-500',
            label: 'Done'
        },
        pending: {
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500',
            label: 'Pending'
        },
        confirmed: {
            color: 'text-blue-500',
            bgColor: 'bg-blue-500',
            label: 'Confirmed'
        }
    };

    const currentStatus = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className={`flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border 
            border-gray-200 hover:shadow-md transition-shadow ${className}`}>
            
            {/* Image */}
            <div className="w-full sm:w-32 h-32 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img 
                    src={image || '/placeholder-lab.jpg'} 
                    alt={pathologyName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Lab';
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* Booking ID & Status */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm text-gray-500">
                            Booking ID: <span className="text-gray-700 font-medium">{bookingId}</span>
                        </span>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${currentStatus.bgColor}`} />
                            <span className={`text-sm font-medium ${currentStatus.color}`}>
                                {currentStatus.label}
                            </span>
                        </div>
                    </div>

                    {/* Pathology Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {pathologyName}
                    </h3>

                    {/* Test Name */}
                    <p className="text-sm text-gray-600 mb-2">{testName}</p>

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(date)}</span>
                        <span>{time}</span>
                    </div>
                </div>

                {/* View Details Button */}
                <div className="mt-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetails(booking)}
                        className="!rounded-lg"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;