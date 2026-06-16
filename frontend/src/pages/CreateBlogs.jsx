import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import { BASE_URL } from '../config/Config';

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEcode, setAuthorEcode] = useState('');
  const [category, setCategory] = useState('');
  const [snippet, setSnippet] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const BLOG_API_BASE_URL = `http://localhost:9049/api/blogs`;

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  useEffect(() => {
    const storedEmpId = localStorage.getItem("empId");
    if (storedEmpId) {
      setAuthorEcode(String(storedEmpId).trim());
    }

    if (!window.Quill) {
      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
      script.onload = initializeQuill;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else {
      initializeQuill();
    }
  }, []);

  const initializeQuill = () => {
    if (editorRef.current && !quillRef.current) {
      const quill = new window.Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog content here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
      });

      quillRef.current = quill;

      quill.on('text-change', () => {
        setFullContent(quill.root.innerHTML);
      });
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
    formData.append('category', category);
    formData.append('snippet', snippet);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post(BLOG_API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        showNotification('Blog post created successfully!', 'success');
        navigate('/blogs');
      } else {
        showNotification('Failed to create blog post.', 'error');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      showNotification('Error creating blog post. Please check console.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16 mt-14">
        {notification.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white
            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}

        <div className="text-sm text-gray-500 mb-6 font-sans">
          <span onClick={() => navigate('/dashboard')} className="hover:underline cursor-pointer text-gray-700">Home</span>
          <span className="mx-2">/</span>
          <span onClick={() => navigate('/blogs')} className="hover:underline cursor-pointer text-gray-700">Blogs</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">Create New Blog</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>

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
              <div
                id="editor"
                ref={editorRef}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></div>
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
                onClick={() => navigate('/blogs')}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
