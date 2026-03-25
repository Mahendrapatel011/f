import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaChevronLeft, FaPlayCircle } from 'react-icons/fa';
import blogService from '../../services/blogService';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = 'http://localhost:5000';

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await blogService.getBlogBySlug(slug);
                if (res.success) {
                    setBlog(res.data);
                } else {
                    throw new Error('Not found');
                }
            } catch (error) {
                const mockBlogs = {
                    'understanding-lab-reports': {
                        title: 'Understanding Your Lab Reports: A Comprehensive Guide',
                        content: `<p>Decoding medical jargon can be tough. Your lab report is a direct look at what's happening inside your body, but without the right guidance, those numbers can look like a mystery.</p><h3>1. The Reference Range</h3><p>Every test has a "normal" or reference range. These are the values expected for healthy individuals. If your result is outside this range, it's marked as High (H) or Low (L).</p><h3>2. Common Blood Tests</h3><p>Tests like CBC (Complete Blood Count) measure everything from red blood cells to platelets. White blood cells are your body's defenders—if they are high, you might have an infection.</p>`,
                        summary: 'Decoding medical jargon can be tough. We break down the most common blood test results and what they mean for your health.',
                        image: 'https://images.unsplash.com/photo-1579152276506-5d5ec24c4e1a?q=80&w=800',
                        category: 'Health Guide',
                        author: 'Dr. Sharma',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        createdAt: new Date()
                    },
                    'essential-annual-tests': {
                        title: 'Top 5 Essential Tests Every Adult Should Take Annually',
                        content: `<p>Preventive healthcare is the best healthcare. Taking these five tests once a year can save you from major complications later.</p><ul><li><strong>Full Body Checkup:</strong> Overall snapshot of health.</li><li><strong>Thyroid Profile:</strong> Critical for metabolism and energy.</li></ul>`,
                        image: 'https://images.unsplash.com/photo-1581594632702-52c1137c0ccf?q=80&w=800',
                        category: 'Wellness',
                        author: 'Admin',
                        createdAt: new Date()
                    }
                };
                if (mockBlogs[slug]) {
                    setBlog(mockBlogs[slug]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c335a]"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800">Blog Not Found</h1>
                <Link to="/" className="text-[#1e3a5f] font-semibold hover:underline flex items-center gap-2">
                    <FaChevronLeft /> Back to Home
                </Link>
            </div>
        );
    }

    const imageUrl = blog.image.startsWith('http') ? blog.image : `${baseUrl}${blog.image}`;
    const isYoutube = blog.videoUrl && (blog.videoUrl.includes('youtube.com') || blog.videoUrl.includes('youtu.be'));
    const isLocalVideo = blog.videoUrl && blog.videoUrl.startsWith('/uploads/');
    const videoUrl = isLocalVideo ? `${baseUrl}${blog.videoUrl}` : blog.videoUrl;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#1e3a5f] transition-colors mb-6">
                    <FaChevronLeft /> Back to Home
                </Link>

                {/* Header: Title Left, Meta Right */}
                <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-8">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 bg-blue-50 text-[#1e3a5f] text-xs font-bold rounded-full mb-4">
                            {blog.category || 'Health'}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-[#1c335a] leading-tight capitalize">
                            {blog.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 text-sm shrink-0 md:mb-2">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <FaUser className="text-[#10b981]" />
                            </div>
                            <span className="font-bold text-gray-800">{blog.author || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                            <FaCalendarAlt className="text-[#10b981]" />
                            <span className="font-bold text-gray-600 uppercase tracking-tighter">
                                {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Body: Media Left (7col), Content Right (5col) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Media Column */}
                    <div className="lg:col-span-7">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200 bg-black aspect-video group">
                            {isLocalVideo ? (
                                <video src={videoUrl} controls className="w-full h-full object-contain" poster={imageUrl} />
                            ) : (
                                <>
                                    <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    {blog.videoUrl && isYoutube && (
                                        <a href={blog.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all opacity-100 md:opacity-0 group-hover:opacity-100">
                                            <div className="flex flex-col items-center gap-4">
                                                <FaPlayCircle className="text-7xl text-white drop-shadow-2xl animate-pulse" />
                                                <span className="bg-[#1e3a5f] text-white px-8 py-3 rounded-full font-black shadow-2xl uppercase tracking-widest text-xs">Watch Video</span>
                                            </div>
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-5">
                        <article className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-50 min-h-[400px] flex flex-col">
                            <div className="prose prose-blue max-w-none text-gray-700 text-lg leading-relaxed break-words flex-1" dangerouslySetInnerHTML={{ __html: blog.content }} />
                            
                            {/* Tags at bottom of content */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                                    {blog.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg hover:bg-[#1e3a5f] hover:text-white transition-all cursor-pointer border border-gray-100">
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    </div>
                </div>

                {/* Bottom CTA Block */}
                <div className="mt-16 bg-gradient-to-br from-[#1c335a] to-[#2a4d80] rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                     <h3 className="text-3xl font-black mb-6 relative z-10 italic">Stay Health-Smart Every Day!</h3>
                     <p className="text-blue-100 mb-10 max-w-2xl mx-auto relative z-10 text-lg">
                         Expert insights delivered straight to you. Book your next pathology test with us for accurate results and professional care.
                     </p>
                     <div className="flex flex-wrap justify-center gap-6 relative z-10">
                          <Link to="/listing" className="px-10 py-4 bg-[#10b981] text-white font-black rounded-2xl shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-widest text-sm">
                             Find Pathologies
                         </Link>
                         <button className="px-10 py-4 bg-white text-[#1c335a] font-black rounded-2xl shadow-xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-widest text-sm">
                             Share Article
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
