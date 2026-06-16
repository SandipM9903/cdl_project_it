import React, { useState } from 'react';

function ImagePopup({ fileUrl, onClose, onUpdateImage }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(fileUrl); // Start with the original image

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create a temporary URL to preview the image
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpdateImage(selectedFile);
            onClose(); // Optionally close the popup after uploading
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-red-500">X</button>
                <img
                    src={previewUrl}  // Use the preview URL to show the selected image
                    alt="Profile"
                    className="w-[300px] h-[300px] object-cover rounded-lg mb-4"
                />
                <input type="file" onChange={handleFileChange} />
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleUpload}
                >
                    Upload Image
                </button>
            </div>
        </div>
    );
}

export default ImagePopup;
