import { FaStar } from 'react-icons/fa';

const ReviewCard = ({
    username = 'Username',
    date = 'Date of review',
    rating = 0,
    review = ''
}) => {
    const renderStars = () => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`w-3 h-3 ${index < rating ? 'text-[#1e3a5f]' : 'text-gray-200'}`}
            />
        ));
    };

    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-gray-800 text-sm">{username}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-xs">{date}</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
                {renderStars()}
                <span className="text-gray-900 font-bold text-xs ml-1">{rating}.0</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{review}</p>
        </div>
    );
};

export default ReviewCard;