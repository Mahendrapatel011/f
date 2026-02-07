const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-blue-100 text-blue-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        outline: 'bg-white border border-gray-300 text-gray-600'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span className={`
            inline-block rounded-full font-medium
            ${variants[variant]}
            ${sizes[size]}
            ${className}
        `}>
            {children}
        </span>
    );
};

export default Badge;