import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
// Removed direct import 'react-toastify/dist/ReactToastify.css';
import { Search, Bell, User } from 'lucide-react';
import { UserCircle2, CalendarDays, Pencil } from 'lucide-react';
// import { BASE_URL } from '../config/Config.jsx'; // Not used, so removing the import
import Header from '../components/Header.jsx';

export default function BlogArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userEmpCode, setUserEmpCode] = useState(null);
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);

  // Define allowed employee codes for the "Edit" button
  const allowedEmpCodes = ['9085176', '9083095', '9086618'];
  // Hardcoding the backend URL as requested
  const BLOG_API_BASE_URL = `http://localhost:9049/api/blogs`;
  const fallbackImageUrl = 'https://www.blendb2b.com/hubfs/BLD%20techncial%20blog.jpeg';

  useEffect(() => {
    // Add the toastify stylesheet to the document head dynamically
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const empCode = String(localStorage.getItem("empId") || "").trim();
    setUserEmpCode(empCode);

    fetchArticle();
    fetchAllBlogsForRelatedPosts();

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [id]);

  const fetchArticle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BLOG_API_BASE_URL}/${id}`);
      setArticle(response.data);
    } catch (err) {
      console.error('Error fetching article:', err);
      if (err.response && err.response.status === 404) {
        setError('Article not found.');
        toast.error('Article not found.');
      } else {
        setError('Failed to load article. Please check your network and backend server.');
        toast.error('Failed to load article.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBlogsForRelatedPosts = async () => {
    try {
      const response = await axios.get(BLOG_API_BASE_URL);
      const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllBlogs(sortedBlogs);
    } catch (err) {
      console.error('Error fetching all blogs for related posts:', err);
    }
  };

  const handleEditBlog = () => {
    navigate(`/blogs/edit/${article.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const parts = dateString.split(/[-T:.]/);
        const parsedDate = new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
          parseInt(parts[3] || 0),
          parseInt(parts[4] || 0),
          parseInt(parts[5] || 0)
        );
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return dateString;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading article...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14 flex items-center justify-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14 flex items-center justify-center">
          <p className="text-xl text-gray-700">Article not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14">
        <ToastContainer />

        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6 font-sans">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:underline cursor-pointer text-gray-700"
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            onClick={() => navigate('/blogs')}
            className="hover:underline cursor-pointer text-gray-700"
          >
            Blogs
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold line-clamp-1 max-w-[calc(100%-150px)] inline-block align-bottom">
            {article.title}
          </span>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 lg:p-12 mb-12 relative">
          {/* Edit button for Article */}
          {userEmpCode && allowedEmpCodes.includes(userEmpCode) && (
            <button
              onClick={handleEditBlog}
              className="absolute top-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
              title="Edit Blog"
            >
              <Pencil size={20} />
            </button>
          )}

          {/* Article Header */}
          <div className="mb-8">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 w-fit">
              {article.category || 'GENERAL'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <img
                src={article.authorAvatar || 'https://placehold.co/40x40/E0E0E0/333333?text=AU'}
                alt={article.authorName}
                className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/E0E0E0/333333?text=AU"; }}
              />
              <span className="font-medium text-gray-800">{article.authorName || 'Unknown Author'}</span>
              <span className="mx-2">•</span>
              <CalendarDays size={16} className="mr-1 text-gray-500" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>

          {/* Article Image - Correctly constructed URL and fallback */}
          {article.imagePath && (
            <img
              src={article.imagePath ? `${BLOG_API_BASE_URL}/images/${article.imagePath}` : fallbackImageUrl}
              alt={article.title}
              className="w-full rounded-lg object-cover mb-8 max-h-[400px]"
              onError={(e) => { e.target.onerror = null; e.target.src=fallbackImageUrl; }}
            />
          )}

          {/* Article Body Content (using dangerouslySetInnerHTML) */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.fullContent }}
          />

          {/* Social Share Icons (mock) */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-end space-x-4 text-gray-600">
            <span className="font-medium text-sm">Share:</span>
            <a href="#" className="hover:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-17 9.4A16.5 16.5 0 0 1 2 8c0 8 7 12 12 12 1.1 0 1.7 0 2 0 1.5 0 3-.5 3-3V7c-.4-.3-1.5-.9-2-1zm-6 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.2 6.86a1 1 0 0 1-1.6 0L2 7"/></svg>
            </a>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">Related Posts</h3>
          {allBlogs.filter(art => art.id !== article.id).length === 0 ? (
            <p className="text-gray-700 text-center">No related posts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Filter to show other blogs, up to 3, excluding the current one */}
              {allBlogs.filter(art => art.id !== article.id).slice(0, 3).map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/blogs/${relatedArticle.id}`)}
                >
                  <img
                    src={relatedArticle.imagePath ? `${BLOG_API_BASE_URL}/images/${relatedArticle.imagePath}` : fallbackImageUrl}
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                    onError={(e) => { e.target.onerror = null; e.target.src=fallbackImageUrl; }}
                  />
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-2">{formatDate(relatedArticle.createdAt)}</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {relatedArticle.snippet || 'No snippet available.'}
                    </p>
                    <div className="flex items-center">
                      <img
                        src={relatedArticle.authorAvatar || 'https://placehold.co/30x30/D0D0D0/444444?text=AU'}
                        alt={relatedArticle.authorName}
                        className="w-8 h-8 rounded-full mr-3 border border-gray-200"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/30x30/D0D0D0/444444?text=AU"; }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{relatedArticle.authorName || 'Unknown Author'}</p>
                        <p className="text-xs text-gray-600">{relatedArticle.authorEcode || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
