import React, { useEffect, useState } from 'react';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../config/Config';

// API Endpoints
const API_BASE_URL = `${BASE_URL}`;
const HOT_JOBS_LIST_API = `${API_BASE_URL}/documents/root-hot_jobs`; // Used for both GET (list) and POST (upload)
const IMAGE_ACCESS_API = `${API_BASE_URL}/documents/access`; // Prepended with /docId for image source
const IMAGE_DELETE_API = `${API_BASE_URL}/documents`; // Base for DELETE, will append /docId

export default function HotJobs() { 
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [canAdd, setCanAdd] = useState(false);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [documentDTO, setDocumentDTO] = useState({
    empCode: '',
    empOrg: '',
    location: '',
    docTags: 'happitude',
    docCaption: '',
    docDescription: 'happitude images',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const allowedEmpCodes = ['9085176', '9085177', '9083095' , '9078973' ,'9079597'];

  const fetchHotJobs = async () => {
    try {
      const response = await axios.get(HOT_JOBS_LIST_API);
      const fetchedImages = response.data.map(doc => ({
        docId: doc.docId,
        src: `${IMAGE_ACCESS_API}/${doc.docId}`,
        createdAt: doc.createdDate,
        title: doc.docCaption,
      }));
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching hot jobs:", error);
      toast.error("Failed to load hot jobs from the server.");
      if (error.response && error.response.status === 404) {
        setImages([]);
      }
    }
  };

  const handleAddImage = async () => {
    if (!file) {
      toast.error("Please select an image file.");
      return;
    }
    if (!documentDTO.docCaption || !documentDTO.createdAt) {
      toast.error("Please fill in the Job Role and Posted Date.");
      return;
    }

    const formData = new FormData();
    formData.append('documentDTO', JSON.stringify(documentDTO));
    formData.append('files', file);

    try {
      const response = await axios.post(HOT_JOBS_LIST_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Upload successful:', response.data);
      toast.success("Hot Job image added successfully!");
      await fetchHotJobs();

      setFile(null);
      setDocumentDTO(prev => ({
        ...prev,
        docCaption: '',
        createdAt: new Date().toISOString().split('T')[0],
      }));
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to add Hot Job image. Please try again.");
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(`Server error: ${error.response.data?.message || error.response.statusText || 'Unknown server error'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Check network connection.");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error(`Request error: ${error.message}`);
      }
    }
  };

  const handleDeleteImage = async (docId, event) => {
    event.stopPropagation(); // Stop event propagation to prevent opening the fullscreen modal

    if (window.confirm("Are you sure you want to delete this Hot Job image?")) {
      try {
        const deleteUrl = `${IMAGE_DELETE_API}/${docId}`;
        await axios.delete(deleteUrl);
        toast.success("Hot Job image deleted successfully!");
        fetchHotJobs();
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete Hot Job image. Please try again.");
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          toast.error(`Server error: ${error.response.data?.message || error.response.statusText || 'Unknown server error'}`);
        } else if (error.request) {
          console.error("No response received:", error.request);
          toast.error("No response from server. Check network connection.");
        } else {
          console.error("Error setting up request:", error.message);
          toast.error(`Request error: ${error.message}`);
        }
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const userEmpCode = localStorage.getItem('empId') || sessionStorage.getItem('empCode');
    if (userEmpCode && allowedEmpCodes.includes(userEmpCode)) {
      setCanAdd(true);
    } else {
      setCanAdd(false);
    }
    fetchHotJobs();
  }, []);

  const sortedImages = [...images].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDocDTOChange = (e) => {
    const { name, value } = e.target;
    setDocumentDTO(prev => ({ ...prev, [name]: value }));
  };

  const isNew = (createdAt) => {
    const uploadDate = new Date(createdAt);
    if (isNaN(uploadDate.getTime())) {
      console.warn("Invalid date encountered:", createdAt);
      return false;
    }
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours <= 24;
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">
        <div className="text-sm text-gray-500 mb-4 space-x-1">
          <span
            onClick={() => navigate('/dashboard')}
            className="hover:underline cursor-pointer text-black"
          >
            Home
          </span>
          <span>/</span>
          <span className="text-black font-semibold">Hot Jobs</span>
        </div>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-[#222]">Hot Jobs</h1>
          {canAdd && (
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setDocumentDTO(prev => ({
                  ...prev,
                  docCaption: '',
                  createdAt: new Date().toISOString().split('T')[0],
                }));
                setFile(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-lg transition duration-300"
            >
              <PlusCircle size={20} className="mr-2" />
              Add New
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedImages.length > 0 ? (
            sortedImages.map((img, index) => (
              <div
                key={img.docId || index}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 relative"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.title || `Hot Job Image ${index}`}
                  className="w-full h-64 object-cover"
                />
                {isNew(img.createdAt) && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce-slow">
                    NEW
                  </span>
                )}
                <div className="p-4 border-t flex flex-col"> {/* Use flex-col to stack title/date and button */}
                  <div className="flex justify-between items-start mb-2"> {/* Container for title/date and delete button */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{img.title}</h3>
                      <p className="text-sm text-gray-600">
                        Posted:{' '}
                        {new Date(img.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {canAdd && ( // Conditionally render the delete button
                      <button
                        onClick={(event) => handleDeleteImage(img.docId, event)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors" // Smaller, subtle button
                        aria-label={`Delete ${img.title || 'image'}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg">No hot job images available. Add one using the "Add New" button!</p>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 z-50 p-2 rounded-full bg-gray-800 bg-opacity-50"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage.src}
            alt="Selected Hot Job"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Add New Image Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add New Hot Job</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFile(null);
                  setDocumentDTO(prev => ({
                    ...prev,
                    docCaption: '',
                    createdAt: new Date().toISOString().split('T')[0],
                  }));
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Image:</label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {file && <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>}
              </div>
              <div>
                <label htmlFor="docCaption" className="block text-sm font-medium text-gray-700 mb-1">Job Role / Title:</label>
                <input
                  type="text"
                  id="docCaption"
                  name="docCaption"
                  value={documentDTO.docCaption}
                  onChange={handleDocDTOChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700 mb-1">Posted Date:</label>
                <input
                  type="date"
                  id="createdAt"
                  name="createdAt"
                  value={documentDTO.createdAt}
                  onChange={handleDocDTOChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFile(null);
                  setDocumentDTO(prev => ({
                    ...prev,
                    docCaption: '',
                    createdAt: new Date().toISOString().split('T')[0],
                  }));
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}