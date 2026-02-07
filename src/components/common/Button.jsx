const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    disabled = false,
    ...props
}) => {
    const baseStyles = 'font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
        primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white shadow-md hover:shadow-xl cursor-pointer transition-all duration-300',
        outline: 'border-2 border-teal-500 text-teal-500 hover:bg-teal-50',
        danger: 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-lg hover:shadow-xl',
        ghost: 'text-gray-800 hover:text-teal-500 hover:bg-teal-50'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3 text-lg',
        lg: 'px-10 py-4 text-lg',
        xl: 'px-12 py-5 text-xl'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;