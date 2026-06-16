import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header.jsx'; // Assuming your Header component
import { BASE_URL } from '../config/Config.jsx';

export default function EditBlog() {
  const { id } = useParams(); // Get the blog ID from the URL for editing
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEcode, setAuthorEcode] = useState('');
  const [category, setCategory] = useState('');
  const [snippet, setSnippet] = useState('');
  const [imageFile, setImageFile] = useState(null); // For new image upload
  const [currentImagePath, setCurrentImagePath] = useState(''); // To display current image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching existing data
  const [error, setError] = useState(null); // Error state for fetching existing data

  // Hardcoding the backend URL as requested
  const BACKEND_URL = `http://localhost:9049`;
  const BLOG_API_BASE_URL = `${BACKEND_URL}/api/blogs`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchBlogData(); // Fetch existing blog data when component mounts or ID changes
  }, [id]); // Depend on 'id' to re-fetch if navigating between edits

  const fetchBlogData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BLOG_API_BASE_URL}/${id}`);
      const blogData = response.data;

      // Populate state with fetched data
      setTitle(blogData.title || '');
      setFullContent(blogData.fullContent || '');
      setAuthorName(blogData.authorName || '');
      setAuthorEcode(blogData.authorEcode || '');
      setCategory(blogData.category || '');
      setSnippet(blogData.snippet || '');
      setCurrentImagePath(blogData.imagePath || ''); // Set current image path

    } catch (err) {
      console.error('Error fetching blog for editing:', err);
      if (err.response && err.response.status === 404) {
        setError('Blog post not found for editing.');
        toast.error('Blog post not found.');
      } else {
        setError('Failed to load blog post for editing. Please check your network and backend server.');
        toast.error('Failed to load blog post for editing.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('fullContent', fullContent);
    formData.append('authorName', authorName);
    formData.append('authorEcode', authorEcode);
    if (category) formData.append('category', category);
    if (snippet) formData.append('snippet', snippet);
    if (imageFile) {
      formData.append('imageFile', imageFile); // Append new image if selected
    } else if (currentImagePath) {
      // If no new image is selected but there was an old one,
      // you might want to send a signal to keep the old image.
      // For Spring Boot, if 'imageFile' is optional, not sending it means keeping the old one.
      // If you want to explicitly remove an image, you'd need a separate mechanism (e.g., a checkbox "Remove Image").
    }

    try {
      const response = await axios.put(`${BLOG_API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      if (response.status === 200) {
        toast.success('Blog post updated successfully!');
        navigate(`/blogs/${id}`); // Navigate back to the individual blog article page
      } else {
        toast.error('Failed to update blog post.');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Error updating blog post. Please check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditional rendering for loading, error, or not found states
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading blog data for editing...</p>
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

  // If article data is not loaded after loading finishes (e.g., 404 not caught by specific error handling)
  if (!title && !fullContent) { // Simple check if article data is empty
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14 flex items-center justify-center">
          <p className="text-xl text-gray-700">Blog post data could not be loaded.</p>
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
          <span onClick={() => navigate('/dashboard')} className="hover:underline cursor-pointer text-gray-700">Home</span>
          <span className="mx-2">/</span>
          <span onClick={() => navigate('/blogs')} className="hover:underline cursor-pointer text-gray-700">Blogs</span>
          <span className="mx-2">/</span>
          <span onClick={() => navigate(`/blogs/${id}`)} className="hover:underline cursor-pointer text-gray-700 line-clamp-1 max-w-[calc(100%-150px)] inline-block align-bottom">
            {title || 'Loading...'}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Edit</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 lg:p-12 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="fullContent" className="block text-sm font-medium text-gray-700 mb-1">Full Content <span className="text-red-500">*</span></label>
              <textarea
                id="fullContent"
                value={fullContent}
                onChange={(e) => setFullContent(e.target.value)}
                rows="10"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="authorEcode" className="block text-sm font-medium text-gray-700 mb-1">Author Employee Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="authorEcode"
                  value={authorEcode}
                  onChange={(e) => setAuthorEcode(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="snippet" className="block text-sm font-medium text-gray-700 mb-1">Snippet (Short Summary)</label>
                <textarea
                  id="snippet"
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>

            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Feature Image</label>
              {currentImagePath && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={`${BACKEND_URL}${currentImagePath}`}
                    alt="Current Blog Image"
                    className="w-48 h-32 object-cover rounded-md shadow-sm border border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/192x128/E0E0E0/333333?text=Image+Error"; }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Select a new file to replace the current image.</p>
                </div>
              )}
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/blogs/${id}`)} // Navigate back to the article page
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
