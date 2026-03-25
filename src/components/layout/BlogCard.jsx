import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaChevronRight } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
    const baseUrl = 'http://localhost:5000';
    const imageUrl = blog.image.startsWith('http') ? blog.image : `${baseUrl}${blog.image}`;
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <Link to={`/blog/${blog.slug}`} className="relative block h-48 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#1e3a5f] text-white text-xs font-semibold rounded-full shadow-lg">
                        {blog.category || 'Health'}
                    </span>
                </div>
            </Link>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                {/* Meta Details */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-[#10b981]" />
                        {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaUser className="text-[#1e3a5f]" />
                        {blog.author || 'Admin'}
                    </span>
                </div>

                {/* Title */}
                <Link to={`/blog/${blog.slug}`}>
                    <h3 className="text-lg font-bold text-[#1c335a] mb-3 line-clamp-2 hover:text-[#1e3a5f] transition-colors">
                        {blog.title}
                    </h3>
                </Link>

                {/* Summary */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.summary}
                </p>

                {/* Footer / Read More */}
                <div className="mt-auto">
                    <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c335a] hover:text-[#1e3a5f] transition-all group/btn"
                    >
                        Read Full Blog
                        <FaChevronRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
