// components/ProfileAvatar.jsx
import { useRef } from 'react';
import { FaCamera } from 'react-icons/fa';

const ProfileAvatar = ({ 
    src, 
    alt = 'Profile', 
    size = 'lg',
    editable = true,
    onImageChange 
}) => {
    const fileInputRef = useRef(null);

    const sizes = {
        sm: 'w-16 h-16',
        md: 'w-20 h-20',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const handleClick = () => {
        if (editable && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onImageChange) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative inline-block">
            <div 
                className={`
                    ${sizes[size]} 
                    rounded-full 
                    overflow-hidden 
                    border-4 
                    border-white 
                    shadow-lg
                `}
            >
                <img
                    src={src || '/default-avatar.png'}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
            
            {editable && (
                <>
                    <button
                        type="button"
                        onClick={handleClick}
                        className="
                            absolute bottom-0 right-0
                            w-8 h-8
                            bg-[#1e3a5f] 
                            rounded-full 
                            flex items-center justify-center
                            text-white
                            hover:bg-[#2d4a6f]
                            transition-colors
                            shadow-md
                            border-2 border-white
                        "
                    >
                        <FaCamera className="text-sm" />
                    </button>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </>
            )}
        </div>
    );
};

export default ProfileAvatar;