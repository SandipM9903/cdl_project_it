import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // This line was causing the error
import { Search, Bell, User } from 'lucide-react';
import { PlusCircle, Trash2 } from 'lucide-react';

import Header from '../components/Header.jsx';

export default function Blogs() {
  const navigate = useNavigate();
  const [userEmpCode, setUserEmpCode] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [heroArticle, setHeroArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NOTE: In a real-world scenario, you would fetch this from an environment variable or a config file
  const BASE_URL = `http://localhost:9049`;
  const fallbackImageUrl = 'https://www.blendb2b.com/hubfs/BLD%20techncial%20blog.jpeg';
  const allowedEmpCodes = ['9085176', '9083095', '9086618'];
  const BLOGS_API_URL = `${BASE_URL}/api/blogs`;

  useEffect(() => {
    // Add the toastify stylesheet to the document head
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const empCode = String(localStorage.getItem("empId") || "").trim();
    setUserEmpCode(empCode);
    fetchBlogs();
    
    return () => {
      // Clean up the added stylesheet when the component unmounts
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(BLOGS_API_URL);
      let fetchedBlogs = response.data;

      fetchedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const blogsWithImages = fetchedBlogs.map((bl) => {
        let imageUrl = fallbackImageUrl;
        if (bl.imagePath && typeof bl.imagePath === 'string') {
          imageUrl = `${BASE_URL}/api/blogs/images/${bl.imagePath}`;
        }

        return {
          ...bl,
          imageUrl,
        };
      });

      setBlogs(blogsWithImages);
      setHeroArticle(blogsWithImages.length > 0 ? blogsWithImages[0] : null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts. Please check your network and backend server.');
      toast.error('Failed to load blog posts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/blogs/${articleId}`);
  };

  const handleAddBlogClick = () => {
    navigate('/blogs/create');
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`${BLOGS_API_URL}/${blogId}`);
      toast.success('Blog post deleted successfully!');
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      const errorMessage = err.response?.data || 'Failed to delete blog post.';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }

      const parts = dateString.split(/[-T:.]/);
      const parsedDate = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
        parseInt(parts[3] || 0),
        parseInt(parts[4] || 0),
        parseInt(parts[5] || 0)
      );

      return !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : dateString;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14">
        <ToastContainer />

        <div className="text-sm text-gray-500 mb-6 font-sans">
          <span onClick={() => navigate('/dashboard')} className="hover:underline cursor-pointer text-gray-700">
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Blogs</span>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 text-gray-700">
            <p className="text-lg">No blog posts available yet.</p>
            {allowedEmpCodes.includes(userEmpCode) && (
              <button
                onClick={handleAddBlogClick}
                className="mt-6 px-6 py-3 rounded-full bg-red-600 text-white text-base font-medium hover:bg-red-700 transition-colors shadow-md flex items-center mx-auto"
              >
                <PlusCircle size={20} className="mr-2" /> Create First Blog
              </button>
            )}
          </div>
        ) : (
          <>
            {heroArticle && (
              <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg mb-12">
                <img
                  src={heroArticle.imageUrl}
                  alt={heroArticle.title}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  onClick={() => handleArticleClick(heroArticle.id)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImageUrl;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-8 flex flex-col justify-end text-white">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 w-fit">
                    {heroArticle.category || 'GENERAL'}
                  </span>
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-3 leading-tight cursor-pointer"
                    onClick={() => handleArticleClick(heroArticle.id)}
                  >
                    {heroArticle.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-200">
                    <img
                      src={heroArticle.authorAvatar || 'https://placehold.co/40x40/E0E0E0/333333?text=AU'}
                      alt={heroArticle.authorName}
                      className="w-8 h-8 rounded-full mr-2 border-2 border-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/40x40/E0E0E0/333333?text=AU';
                      }}
                    />
                    <span className="font-medium">{heroArticle.authorName || 'Unknown Author'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(heroArticle.createdAt)}</span>
                  </div>
                </div>
                {allowedEmpCodes.includes(userEmpCode) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBlog(heroArticle.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                    title="Delete Blog"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            )}
            
            <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <h3 className="text-2xl font-bold text-gray-800">Popular topics</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {['All', 'Technology', 'Research', 'Design', 'Development'].map((topic) => (
                    <span
                      key={topic}
                      className="px-4 py-2 text-sm bg-white rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              {allowedEmpCodes.includes(userEmpCode) && (
                <button
                  onClick={handleAddBlogClick}
                  className="px-6 py-3 rounded-full bg-red-600 text-white text-base font-medium hover:bg-red-700 transition-colors shadow-md inline-flex items-center mt-5 md:mt-0"
                >
                  <PlusCircle size={20} className="mr-2" /> Create Blog
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.slice(1).map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImageUrl;
                    }}
                  />
                  <div className="p-5">
                    <span className="text-sm text-blue-600 font-medium mb-1 block">
                      {article.category || 'GENERAL'}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{article.snippet}</p>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                  {allowedEmpCodes.includes(userEmpCode) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlog(article.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                      title="Delete Blog"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
