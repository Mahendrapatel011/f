import { useState, useEffect } from 'react';
import { FaArrowRight, FaRss } from 'react-icons/fa';
import blogService from '../../services/blogService';
import BlogCard from './BlogCard';

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await blogService.getBlogs();
                if (res.success && res.data.length > 0) {
                    setBlogs(res.data.slice(0, 3));
                } else {
                    // Fallback Mock Data if no blogs in DB
                    setBlogs([
                        {
                            _id: 'mock1',
                            title: 'Understanding Your Lab Reports: A Comprehensive Guide',
                            summary: 'Decoding medical jargon can be tough. We break down the most common blood test results and what they mean for your health.',
                            image: 'https://images.unsplash.com/photo-1579152276506-5d5ec24c4e1a?q=80&w=800',
                            category: 'Health Guide',
                            author: 'Dr. Sharma',
                            slug: 'understanding-lab-reports',
                            createdAt: new Date()
                        },
                        {
                            _id: 'mock2',
                            title: 'Top 5 Essential Tests Every Adult Should Take Annually',
                            summary: 'Preventive healthcare starts with regular screening. Learn about the five critical tests that can help detect issues early.',
                            image: 'https://images.unsplash.com/photo-1581594632702-52c1137c0ccf?q=80&w=800',
                            category: 'Wellness',
                            author: 'Admin',
                            slug: 'essential-annual-tests',
                            createdAt: new Date()
                        },
                        {
                            _id: 'mock3',
                            title: 'How Diet and Lifestyle Impact Your Blood Sugar Levels',
                            summary: 'Managing diabetes is more than just medication. Explore how simple changes in your routine can make a massive difference.',
                            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800',
                            category: 'Lifestyle',
                            author: 'Nutritionist Neha',
                            slug: 'diet-lifestyle-impact',
                            createdAt: new Date()
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c335a]"></div>
            </section>
        );
    }

    if (blogs.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden" id="blog">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-[#1e3a5f] font-bold text-sm uppercase tracking-widest mb-3">
                            <FaRss className="text-lg" />
                            <span>Latest Insights</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1c335a] mb-4">
                            Stay Updated with Our <br />
                            <span className="text-[#1e3a5f]">Health & Wellness</span> Blogs
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Expert advice, latest health trends, and lab reports guide to help you manage your health better.
                        </p>
                    </div>
                    
                    <button className="flex items-center gap-3 px-6 py-3 bg-white text-[#1c335a] font-bold rounded-xl border border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-all shadow-sm hover:shadow-md group">
                        View All Blogs
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>
                
                {/* Bottom Call to Action (Subtle) */}
                <div className="mt-16 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <FaRss className="text-[#1e3a5f] text-xl" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-[#1c335a]">Subscribe to our newsletter</h4>
                            <p className="text-sm text-gray-500 text-center">Get the latest articles delivered right to your inbox weekly.</p>
                        </div>
                    </div>
                    
                    <div className="flex w-full md:w-auto gap-2">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 min-w-[200px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                        />
                        <button className="px-6 py-3 bg-[#1c335a] text-white font-bold rounded-xl hover:bg-[#1e3a5f] transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
