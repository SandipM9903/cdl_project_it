import React, { useState, useEffect, useCallback } from 'react';
import { Folder, X, ZoomIn, ZoomOut, RotateCcw, PlusCircle, Link, Trash2 } from 'lucide-react'; // Import Trash2 icon
import toast, { Toaster } from 'react-hot-toast'; // Ensure Toaster is used in the root App component or here if this is your main layout
import Header from './Header'; 

// Import the Pravin logo
import PravinLogo from '../assets/Icons/Pravin-Final-11-01-2023.png'; // Adjust path if necessary

const API_BASE_URL = 'http://43.205.24.208:9023/documents';
const CURRENT_USER_EMP_CODE = localStorage.getItem("empId"); 
const FOLDER_UPLOAD_AUTHORIZED_EMP_CODES = {
    'hr_communications': ['9079597', '9083522', '9080699', '9085176','9083095'],
    'happitude': ['7736', '9086618', '9085176','9083095'],
    'praviin': ['9082697', '9079597', '9085176','9083095'],
    'marketing_communication': ['9086618', '7736', '9085176','9083095'],
    'others': ['9082292', '9080699', '9082050', '9085766', '9085176','9083095']
};

const ADMIN_EMP_CODE = '9085176';

export default function AnnouncementDashboard() {
    const [activeFolder, setActiveFolder] = useState(null);
    const [folders, setFolders] = useState([]); // State to store dynamically fetched folders
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [loadingImages, setLoadingImages] = useState(false);
    const [error, setError] = useState(null);

    const [documentDTO, setDocumentDTO] = useState({
        empCode: CURRENT_USER_EMP_CODE,
        empOrg: 'CMS Computers India Private Ltd.',
        location: 'Bengaluru', 
        docTags: '',
        docCaption: '',
        docDescription: '',
    });

    const getFolderDetails = useCallback((apiFolderName) => {
        const lowerCaseName = apiFolderName.toLowerCase();
        let displayName = apiFolderName;
        let color = 'from-gray-400 to-gray-600'; // Default color

        switch (lowerCaseName) {
            case 'hr_communications':
                displayName = 'HR COMMUNICATIONS';
                color = 'from-red-400 to-red-900';
                break;
            case 'happitude':
                displayName = 'HAPPITUDE';
                color = 'from-red-400 to-red-900';
                break;
            case 'praviin':
                displayName = 'PRAVIIN';
                color = 'from-red-400 to-red-900';
                break;
            case 'marketing_communication':
                displayName = 'Marketing Communications';
                color = 'from-red-400 to-red-900';
                break;
            case 'others':
                displayName = 'Others';
                color = 'from-red-400 to-red-900';
                break;
            default:
                displayName = apiFolderName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        }
        return { displayName, color, apiFolderName };
    }, []);

    const isImageNew = useCallback((createdAt) => {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24); // Subtract 24 hours
        const createdDate = new Date(createdAt);
        return createdDate > twentyFourHoursAgo;
    }, []);

    const extractSurveyLink = useCallback((description) => {
        if (!description) return null;
        const match = description.match(/\[\[SURVEY_LINK_START\]\](.*?)\[\[SURVEY_LINK_END\]\]/);
        return match ? match[1] : null;
    }, []);

    useEffect(() => {
        const fetchFolders = async () => {
            setLoadingFolders(true);
            setError(null);
            try {
                const preDefinedFolders = [
                    'hr_communications',
                    'happitude',
                    'praviin',
                    'marketing_communication',
                    'others'
                ].map((name, index) => {
                    const details = getFolderDetails(name);
                    let hasNew = false;
                    
                    if (name.toLowerCase() === 'hr_communications' || name.toLowerCase() === 'praviin') {
                        hasNew = true;
                    }
                    return {
                        id: index + 1,
                        name: details.displayName,
                        apiName: name,
                        color: details.color,
                        images: [], 
                        hasNew: hasNew 
                    };
                });

                setFolders(preDefinedFolders);
            } catch (err) {
                console.error("Error fetching folders:", err);
                toast.error("Failed to load folders.");
                setError("Failed to load folders.");
            } finally {
                setLoadingFolders(false);
            }
        };
        fetchFolders();
    }, [getFolderDetails]);

    // Fetch images when a folder is clicked
    const fetchImagesForFolder = useCallback(async (folder) => {
        setLoadingImages(true);
        setError(null);
        try {
            const endpoint = `${API_BASE_URL}/root-communications-${folder.apiName}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            let folderHasNewByContent = false;
            const fetchedImages = data.map(item => {
                const isNew = isImageNew(item.createdDate);
                if (isNew) { 
                    folderHasNewByContent = true;
                }
                const extractedDocLink = extractSurveyLink(item.docDescription);
                const cleanDescription = item.docDescription ? item.docDescription.replace(/\[\[SURVEY_LINK_START\]\].*?\[\[SURVEY_LINK_END\]\]/g, '') : '';

                return {
                    docId: item.docId,
                    src: `${API_BASE_URL}/access/${item.docId}`,
                    createdAt: item.createdDate || new Date().toISOString().split('T')[0],
                    title: item.docCaption || item.itemName || 'Untitled Image',
                    description: cleanDescription || '',
                    isNew: isNew, 
                    docLink: extractedDocLink,
                };
            });

            let finalFolderHasNew = folderHasNewByContent;

            if (folder.apiName.toLowerCase() === 'hr_communications' || folder.apiName.toLowerCase() === 'praviin') {
                finalFolderHasNew = true;
            }

            setFolders(prevFolders =>
                prevFolders.map(f =>
                    f.id === folder.id ? { ...f, images: fetchedImages, hasNew: finalFolderHasNew } : f
                )
            );
            setActiveFolder({ ...folder, images: fetchedImages, hasNew: finalFolderHasNew }); // Set active folder with fetched images and updated hasNew

        } catch (err) {
            console.error(`Error fetching images for ${folder.name}:`, err);
            toast.error(`Failed to load images for ${folder.name}.`);
            setError(`Failed to load images for ${folder.name}.`);
        } finally {
            setLoadingImages(false);
        }
    }, [isImageNew, extractSurveyLink]);


    const handleFolderClick = (folder) => {
        if (!folder.images || folder.images.length === 0 || activeFolder?.id !== folder.id) {
            fetchImagesForFolder(folder);
        } else {
            setActiveFolder(folder);
        }

        setDocumentDTO(prevDto => ({
            ...prevDto,
            docTags: folder.apiName.replace(/_/g, '-'),
            docCaption: folder.name,
        }));
    };

    const sortedImages = activeFolder?.images?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const openImageModal = (img) => {
        setSelectedImage(img);
        setZoomLevel(1);
        setOffset({ x: 0, y: 0 });
    };

    const handleModalImageClick = () => {
        if (selectedImage?.docLink) {
            window.open(selectedImage.docLink, '_blank');
        } else {
            toast.info("No survey link available for this image.");
        }
    };

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom - 0.1, 0.5));
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
        setOffset({ x: 0, y: 0 });
    };

    // --- Panning Handlers ---
    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setOffset({
                x: e.clientX - startDrag.x,
                y: e.clientY - startDrag.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // --- Upload Modal Handlers ---
    const handleOpenUploadModal = () => {
        if (!activeFolder) {
            toast.info("Please select a folder first before uploading an announcement.");
            return;
        }
        setShowUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        // Clear description in case it had a survey link
        setDocumentDTO(prev => ({ ...prev, docDescription: '' }));
    };

    const handleSubmitUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const date = formData.get('date');
        const imageFile = formData.get('image');
        const description = formData.get('description');
        const surveyLink = formData.get('surveyLink'); // Now this input is visible and its value is used

        if (!activeFolder) {
            toast.error("Error: No active folder selected for upload.");
            return;
        }

        const folderApiName = activeFolder.apiName;
        let targetUrl = `${API_BASE_URL}/root-communications-${folderApiName}`;

        let combinedDescription = description || `${activeFolder.name} image uploaded on ${date}`;
        if (surveyLink) {
            // Prepend the survey link tag to the description
            combinedDescription = `[[SURVEY_LINK_START]]${surveyLink}[[SURVEY_LINK_END]] ` + combinedDescription;
        }

        let updatedDocumentDTO = {
            ...documentDTO,
            docCaption: title,
            docDescription: combinedDescription,
            docTags: folderApiName.replace(/_/g, '-'),
            createdDate: date, 
        };

        let uploadFormData = new FormData();
        uploadFormData.append('documentDTO', JSON.stringify(updatedDocumentDTO));
        uploadFormData.append('files', imageFile);

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                body: uploadFormData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);
                toast.success('Image and details submitted successfully!');
                handleCloseUploadModal();
                fetchImagesForFolder(activeFolder);
            } else {
                const errorText = await response.text();
                console.error('Upload failed:', response.status, errorText);
                toast.error(`Failed to upload: ${errorText}`);
            }
        } catch (error) {
            console.error('Error during upload:', error);
            toast.error('An error occurred during upload.');
        }
    };

    const handleDeleteImage = async (docId, event) => {
        event.stopPropagation(); // Prevent opening the image modal when clicking delete
        
        // Replace window.confirm with react-hot-toast or a custom modal for confirmation
        // For demonstration, I'll use a simple toast confirmation, but a proper modal is better for "Are you sure?"
        toast((t) => (
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
                <p className="text-gray-800 text-lg mb-4">Are you sure you want to delete this announcement?</p>
                <p className="text-gray-600 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={() => {
                            toast.dismiss(t.id);
                            confirmDelete(docId); // Call the actual delete logic
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity, // Keep toast open until user interacts
            id: 'deleteConfirmToast', // Optional: assign an ID to manage it
        });

        const confirmDelete = async (idToDelete) => {
            setLoadingImages(true); // Show loading while deleting
            try {
                const response = await fetch(`${API_BASE_URL}/${idToDelete}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    toast.success('Announcement deleted successfully!');
                    // Re-fetch images for the active folder to update the UI
                    if (activeFolder) {
                        fetchImagesForFolder(activeFolder);
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Delete failed:', response.status, errorText);
                    toast.error(`Failed to delete announcement: ${errorText}`);
                }
            } catch (error) {
                console.error('Error during deletion:', error);
                toast.error('An error occurred during deletion.');
            } finally {
                setLoadingImages(false);
            }
        };
    };

    const isCurrentUserAuthorizedForUpload = useCallback(() => {
        if (CURRENT_USER_EMP_CODE === ADMIN_EMP_CODE) {
            return true;
        }
        if (!activeFolder) {
            return false;
        }
        const authorizedCodes = FOLDER_UPLOAD_AUTHORIZED_EMP_CODES[activeFolder.apiName.toLowerCase()];
        return authorizedCodes && authorizedCodes.includes(CURRENT_USER_EMP_CODE);
    }, [activeFolder]);

    const isCurrentUserAuthorizedForDelete = useCallback(() => {
        // Using the same authorization for simplicity, as per your original code
        return isCurrentUserAuthorizedForUpload(); 
    }, [isCurrentUserAuthorizedForUpload]);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">
                <div className="mb-8">
                    <div className="text-sm text-gray-500 font-medium mb-2">
                        <a href="/Dashboard" className="text-black hover:underline">Home</a> /{" "}
                        <a href="/announcementDashboard" className="text-black hover:underline">Communications</a>
                        {activeFolder && (
                            <>
                                {" / "}
                                <span className="text-black font-semibold">{activeFolder.name}</span>
                                {activeFolder.apiName.toLowerCase() === 'praviin' }
                            </>
                        )}
                    </div>
                </div>

                {loadingFolders ? (
                    <div className="text-center text-gray-600">Loading folders...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : !activeFolder ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                onClick={() => handleFolderClick(folder)}
                                className="bg-white rounded-2xl shadow-lg group hover:shadow-2xl transition duration-300 p-6 cursor-pointer border border-transparent hover:border-gray-200 relative"
                            >
                                
                                {folder.hasNew && (
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow">
                                        NEW
                                    </span>
                                )}

                                <div className={`w-14 h-14 bg-gradient-to-br ${folder.color} rounded-full flex items-center justify-center text-white shadow-md mb-5`}>
                                    <Folder size={28} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#4a4a4a] font-header">{folder.name}</h2>
                                <div className="flex justify-between mt-6 text-sm text-gray-500">
                                    <span className="hover:text-blue-600 flex items-center gap-1 cursor-pointer">
                                        View
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-semibold text-gray-800 font-content">
                                {activeFolder.name}
                                {activeFolder.apiName.toLowerCase() === 'praviin' && (
                                    <img 
                                        src={PravinLogo} 
                                        alt="Praviin Logo" 
                                        className="ml-3 h-11 inline-block object-contain" // Adjust size as needed for header
                                    />
                                )}
                            </h2>
                        
                            {isCurrentUserAuthorizedForUpload() && (
                                <button
                                    onClick={handleOpenUploadModal}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-lg transition duration-300"
                                >
                                    <PlusCircle size={20} className="mr-2" />
                                    Add New
                                </button>
                            )}
                        </div>
                        {loadingImages ? (
                            <div className="text-center text-gray-600">Loading images...</div>
                        ) : error ? (
                            <div className="text-center text-red-600">{error}</div>
                        ) : sortedImages.length === 0 ? (
                            <div className="text-center text-gray-600">No announcements found in this folder.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {sortedImages.map((img, index) => (
                                    <div
                                        key={img.docId || index}
                                        onClick={() => openImageModal(img)}
                                        className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer relative"
                                    >
                                        {img.isNew && (
                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow">
                                                NEW
                                            </span>
                                        )}

                                        <img
                                            src={img.src}
                                            alt={img.title}
                                            className="w-full h-[384px] object-cover font-content"
                                        />
                                        <div className="p-4 border-t font-content flex justify-between items-center"> {/* Added flex and items-center */}
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 mb-1">
                                                    {img.title}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Created: {new Date(img.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            {isCurrentUserAuthorizedForDelete() && ( 
                                                <button
                                                    onClick={(e) => handleDeleteImage(img.docId, e)}
                                                    className="text-gray-500 hover:text-red-600 transition"
                                                    title="Delete Announcement"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative overflow-hidden flex flex-col h-[90vh]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black z-20"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-bold text-center mb-4 text-red-600">
                            {selectedImage.title}
                        </h3>

                        <div className="absolute top-4 left-4 flex space-x-2 z-20">
                            <button
                                onClick={handleZoomIn}
                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={handleZoomOut}
                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <button
                                onClick={handleResetZoom}
                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                title="Reset Zoom"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>

                        <div
                            className="w-full flex-grow flex items-center justify-center cursor-grab overflow-hidden"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={`${API_BASE_URL}/access/${selectedImage.docId}`}
                                alt={selectedImage.title}
                                className={`max-w-full max-h-full object-contain rounded-lg transition-transform duration-100 ease-out`}
                                style={{
                                    transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px, ${offset.y / zoomLevel}px)`,
                                    transformOrigin: 'center center',
                                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                }}
                                onClick={handleModalImageClick} // Image itself is clickable
                                onDragStart={(e) => e.preventDefault()}
                            />
                        </div>
                        {selectedImage.docLink && (
                            <button
                                onClick={handleModalImageClick}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center shadow-lg transition duration-300 mx-auto"
                            >
                                <Link size={20} className="mr-2" />
                                Go to Survey
                            </button>
                        )}
                    </div>
                </div>
            )}

           {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in-down max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={handleCloseUploadModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-center text-gray-800 mb-6 border-b pb-4">
                            Add New Announcement
                        </h3>

                        <form onSubmit={handleSubmitUpload} className="space-y-6">
                            <div>
                                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m-4-4l.071.071M20 12h4m-4 0v4"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="image" type="file" className="sr-only" accept="image/*" required />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-lg"
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows="3"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    placeholder="Add a brief description"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="surveyLink" className="block text-sm font-medium text-gray-700 mb-2">
                                    Survey Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="surveyLink"
                                    id="surveyLink"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    placeholder="e.g., https://forms.gle/your-survey-link"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseUploadModal}
                                    className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Upload Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Toaster />
        </>
    );

}