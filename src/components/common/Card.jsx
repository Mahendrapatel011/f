// components/common/Card.jsx
const Card = ({ 
    children, 
    className = '', 
    padding = 'md',
    shadow = 'md',
    rounded = 'lg',
    ...props 
}) => {
    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    };

    const roundeds = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl'
    };

    return (
        <div 
            className={`
                bg-white 
                ${paddings[padding]} 
                ${shadows[shadow]} 
                ${roundeds[rounded]} 
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;