import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ rating = 0, reviews = 0, size = 'md', showCount = true }) => {
    const sizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const starSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <FaStar key={i} className={`${starSizes[size]} text-yellow-400`} />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <FaStarHalfAlt key={i} className={`${starSizes[size]} text-yellow-400`} />
                );
            } else {
                stars.push(
                    <FaRegStar key={i} className={`${starSizes[size]} text-yellow-400`} />
                );
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            <span className={`font-semibold text-gray-800 ${sizes[size]}`}>{rating}</span>
            <div className="flex items-center gap-0.5">
                {renderStars()}
            </div>
            {showCount && (
                <span className={`text-gray-500 ${sizes[size]}`}>({reviews})</span>
            )}
        </div>
    );
};

export default Rating;