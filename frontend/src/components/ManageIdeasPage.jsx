import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../config/Config';
import Header from '../components/Header'; // Assuming Header is a valid React component

const ManageIdeasPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for editing (e.g., /manage-ideas/123)

  // Form states
  const [occasion, setOccasion] = useState("");
  const [question, setQuestion] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [status, setStatus] = useState("PENDING"); // Default status for new ideas
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingFormIdea, setIsDeletingFormIdea] = useState(false); // For delete button on form
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoadingIdeaForForm, setIsLoadingIdeaForForm] = useState(true); // Loading state when fetching a single idea for form

  // States to hold the original poster's info and submission date for display (read-only)
  const [displayPostedOn, setDisplayPostedOn] = useState("");
  const [displayPostedBy, setDisplayPostedBy] = useState("");

  // Table states
  const [allIdeas, setAllIdeas] = useState([]); // State to store ALL fetched ideas for the table
  const [loadingAllIdeas, setLoadingAllIdeas] = useState(true); // Loading state for the ideas table
  const [errorFetchingAllIdeas, setErrorFetchingAllIdeas] = useState(null); // Error state for the ideas table

  const currentLoggedInUserEmail = localStorage.getItem("email");
  const currentLoggedInUserName = localStorage.getItem("firstName");
  const currentLoggedInUserEmpCode = localStorage.getItem("empId"); 
  const currentFormattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Function to fetch all ideas for the table
  const fetchAllIdeas = async () => {
    setLoadingAllIdeas(true);
    setErrorFetchingAllIdeas(null);
    try {
      const response = await axios.get(`${BASE_URL}:9039/api/celebration/ideas`);
      if (response.status === 200) {
        setAllIdeas(response.data);
      } else {
        toast.warn("Failed to fetch ideas for the table. Please try again.");
        console.warn("Backend responded with non-200 status for fetching all ideas:", response);
        setErrorFetchingAllIdeas("Failed to fetch ideas for the table.");
      }
    } catch (error) {
      console.error("Error fetching all ideas:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : "Network error or internal server error.";
      toast.error(`Error fetching ideas for table: ${errorMessage}`);
      setErrorFetchingAllIdeas(`Error fetching ideas for table: ${errorMessage}`);
    } finally {
      setLoadingAllIdeas(false);
    }
  };

  useEffect(() => {
    // If an ID is present in the URL, fetch the idea for form pre-population
    if (id) {
      const fetchIdeaForForm = async () => {
        try {
          const response = await axios.get(`${BASE_URL}:9039/api/celebration/ideas/${id}`);
          if (response.status === 200) {
            const fetchedIdea = response.data;
            setOccasion(fetchedIdea.occasion || "");
            setQuestion(fetchedIdea.question || "");
            setMessageBody(fetchedIdea.messageBody || "");
            setStatus(fetchedIdea.status || "PENDING");

            // Set display fields based on fetched idea's original data
            setDisplayPostedOn(new Date(fetchedIdea.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
            setDisplayPostedBy(`${fetchedIdea.senderName || 'N/A'} (E. Code: ${fetchedIdea.eCode || 'N/A'})`);

          } else {
            toast.error("Idea not found for editing.");
            navigate('/manage-ideas'); // Redirect to general management if not found
          }
        } catch (error) {
          console.error("Error fetching idea for edit form:", error);
          toast.error("Error loading idea for editing.");
          navigate('/manage-ideas');
        } finally {
          setIsLoadingIdeaForForm(false);
        }
      };
      fetchIdeaForForm();
    } else {
      setIsLoadingIdeaForForm(false); // No ID, so it's not an edit operation
      // Clear form states and display states if no ID is present
      setOccasion("");
      setQuestion("");
      setMessageBody("");
      setStatus("PENDING");
      setPreviewMode(false); 
      setDisplayPostedOn(""); // Clear display for new idea when no ID
      setDisplayPostedBy(""); // Clear display for new idea when no ID
    }

    // Always fetch all ideas for the table whenever the page loads or ID changes
    fetchAllIdeas();
  }, [id, navigate, currentFormattedDate, currentLoggedInUserName, currentLoggedInUserEmpCode]); // Added dependencies

  // Handle form submission (ONLY EDIT/UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
        toast.error("Please select an idea from the table to edit.");
        return;
    }
    if (!occasion.trim() || !question.trim() || !messageBody.trim()) {
      toast.error("Please fill in all required fields (Occasion, Question, Idea).");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update existing idea - always a PUT request now
      const response = await axios.put(`${BASE_URL}:9039/api/celebration/ideas/${id}`, {
        messageBody: messageBody.trim(),
        occasion: occasion.trim(),
        question: question.trim(),
        status: status,
        // senderEmail, senderName, eCode, submissionDate are not updated here
      });
      if (response.status === 200) {
        toast.success("Idea updated successfully! ✨");
        fetchAllIdeas(); // Refresh the table after update
        navigate('/manage-ideas'); // Go back to the base management page to see table
      } else {
        toast.warn("Failed to update idea. Please try again.");
      }
    } catch (error) {
      console.error("Error saving idea:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : "Network error or internal server error.";
      toast.error(`Error saving idea: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deletion from the form (for the idea currently being edited)
  const handleDeleteFromForm = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this idea from the form?")) {
      return;
    }

    setIsDeletingFormIdea(true);
    try {
      const response = await axios.delete(`${BASE_URL}:9039/api/celebration/ideas/${id}`);
      if (response.status === 204) {
        toast.success("Idea deleted successfully! 🗑️");
        fetchAllIdeas(); // Refresh the table
        navigate('/manage-ideas'); // Redirect to base management page after deletion
      } else {
        toast.warn("Failed to delete idea.");
      }
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Error deleting idea.");
    } finally {
      setIsDeletingFormIdea(false);
    }
  };

  // Handle deletion directly from the table row
  const handleDeleteIdeaFromTable = async (ideaId) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        const response = await axios.delete(`${BASE_URL}:9039/api/celebration/ideas/${ideaId}`);
        if (response.status === 204) {
          toast.success("Idea deleted successfully! 🗑️");
          fetchAllIdeas(); // Refresh the table after deletion
          // If the deleted idea was the one being edited, navigate back to base management
          if (id === String(ideaId)) {
            navigate('/manage-ideas');
          }
        } else {
          toast.warn("Failed to delete idea. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting idea:", error);
        toast.error("Error deleting idea.");
      }
    }
  };

  // Function to PUBLISH an idea to the Xcite Cards
  const handlePublishToXciteCards = async (ideaId) => {
    if (window.confirm("Are you sure you want to add this idea to the 'Ideas That Xcite' cards? This will set its status to 'PUBLISHED'.")) {
      try {
        // Fetch the idea first to get its current data
        const currentIdeaResponse = await axios.get(`${BASE_URL}:9039/api/celebration/ideas/${ideaId}`);
        const currentIdea = currentIdeaResponse.data;

        // Prepare update payload: set status to PUBLISHED. eCode is already present in currentIdea.
        const updatePayload = {
            ...currentIdea, // Keep existing fields
            status: "PUBLISHED",
            // Do NOT overwrite eCode here; it should retain its original value
        };

        const response = await axios.put(`${BASE_URL}:9039/api/celebration/ideas/${ideaId}`, updatePayload);
        
        if (response.status === 200) {
          toast.success("Idea added to Xcite Cards successfully! 🎉 (Status set to PUBLISHED)");
          fetchAllIdeas(); // Refresh the table after publishing
        } else {
          toast.warn("Failed to add idea to Xcite Cards. Please try again.");
        }
      } catch (error) {
        console.error("Error publishing idea to Xcite Cards:", error);
        toast.error("Error adding idea to Xcite Cards.");
      }
    }
  };

  const handlePublish = async () => {
    if (!id || !window.confirm("Are you sure you want to publish this idea?")) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.put(`${BASE_URL}:9039/api/celebration/ideas/${id}`, {
        status: "PUBLISHED"
      });
      if (response.status === 200) {
        toast.success("Idea published! 🎉");
        fetchAllIdeas(); // Refresh the table after publishing
      } else {
        toast.warn("Failed to publish idea.");
      }
    } catch (error) {
      console.error("Error publishing idea:", error);
      toast.error("Error publishing idea.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to navigate to the edit form for a specific idea
  const handleEditIdea = (ideaId) => {
    navigate(`/manage-ideas/${ideaId}`);
  };

  // Function to reset the form for adding a new idea
  // Now, this button simply navigates to the base path to clear the form and allow selection
  const handleAddNewIdeaClick = () => {
    navigate('/manage-ideas'); 
    // The useEffect hook will handle resetting the form states when 'id' becomes null
  };


  if (isLoadingIdeaForForm && id) { // Only show loading for form if ID exists (means we are fetching for edit)
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-700 font-content">Loading idea details...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 md:px-8 lg:px-16 mt-14">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600 mb-6 font-medium">
          <span onClick={() => navigate('/dashboard')} className="hover:underline cursor-pointer text-gray-700">Home</span>
         
        
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">
            {id ? "Edit Idea" : "Manage Ideas"} {/* Changed text here */}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-header font-bold text-[#7b2c2c] mb-8 text-center">
          {id ? "Edit Idea" : "Manage Ideas"} {/* Changed text here */}
        </h1>
        <p className="text-lg text-gray-700 text-center mb-12 font-content max-w-3xl mx-auto">
          {id ? "Review and update the selected idea." : "Select an idea from the table below to view and manage its details."}
        </p>

        {/* Form Section: Add/Edit Idea */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 mb-12 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out border border-gray-100">
          {id ? ( // Render form only if an ID is present (edit mode)
            previewMode ? (
              <div className="border border-red-200 rounded-lg p-6 mb-6 bg-red-50 text-gray-800">
                <h3 className="text-2xl font-header font-semibold mb-4 text-red-700">Idea Preview:</h3>
                <p className="mb-3 text-lg"><strong className="font-header text-red-800">Occasion:</strong> {occasion || 'N/A'}</p>
                <p className="mb-3 text-lg"><strong className="font-header text-red-800">Question:</strong> {question || 'N/A'}</p>
                <p className="mb-3 text-lg"><strong className="font-header text-red-800">Idea/Motto:</strong> {messageBody || 'N/A'}</p>
                <p className="mb-3 text-lg"><strong className="font-header text-red-800">Current Status:</strong> <span className={`font-semibold ${status === 'PUBLISHED' ? 'text-green-600' : 'text-orange-600'}`}>{status}</span></p>
                {/* Display "Posted by" and "Posted on" from the display states */}
                <p className="text-base"><strong className="font-header">Posted by:</strong> {displayPostedBy}</p>
                <p className="text-base"><strong className="font-header">Posted on:</strong> {displayPostedOn}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="occasion" className="block text-gray-800 text-base font-semibold mb-2 font-header">Occasion</label>
                  <input
                    type="text"
                    id="occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-200 transition duration-200 font-content text-gray-800 placeholder-gray-400"
                    placeholder="E.g., Independence Day"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="question" className="block text-gray-800 text-base font-semibold mb-2 font-header">Question</label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-200 transition duration-200 font-content text-gray-800 placeholder-gray-400"
                    placeholder='E.g., "What IF" India in 2047 could see us today?'
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="messageBody" className="block text-gray-800 text-base font-semibold mb-2 font-header">Idea / Motto / Catchphrase</label>
                  <textarea
                    id="messageBody"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-200 transition duration-200 font-content text-gray-800 placeholder-gray-400"
                    placeholder="Articulate your innovative idea here..."
                    required
                  ></textarea>
                </div>

                {/* Display-only "Posted on (Date)" and "Posted by (Employee Name)" */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="postedOn" className="block text-gray-800 text-base font-semibold mb-2 font-header">Posted on (Date)</label>
                    <input
                      type="text"
                      id="postedOn"
                      value={displayPostedOn} // Use new display state
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-content cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="postedBy" className="block text-gray-800 text-base font-semibold mb-2 font-header">Posted by (Employee Name)</label>
                    <input
                      type="text"
                      id="postedBy"
                      value={displayPostedBy} // Use new display state
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-content cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>


                {/* Status dropdown for editing */}
                <div>
                  <label htmlFor="status" className="block text-gray-800 text-base font-semibold mb-2 font-header">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-200 transition duration-200 font-content text-gray-800"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                  {/* Back to Add New Button - now clears the selected idea and shows "select from table" */}
                    <button
                      type="button"
                      onClick={handleAddNewIdeaClick}
                      className="px-8 py-3 rounded-full font-bold text-black bg-gray-200 hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-gray-300 font-header"
                    >
                      Clear Form
                    </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-8 py-3 rounded-full font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-orange-300
                      ${previewMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'} font-header`}
                  >
                    {previewMode ? 'Back to Edit' : 'Preview Idea'}
                  </button>

                  {/* Publish and Delete for existing ideas (when id is present) */}
                    <>
                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isSubmitting || isDeletingFormIdea}
                        className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-300 font-header"
                      >
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteFromForm} // Use specific delete for form
                        disabled={isDeletingFormIdea || isSubmitting}
                        className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-300 font-header"
                      >
                        {isDeletingFormIdea ? 'Deleting...' : 'Delete'}
                      </button>
                    </>

                  {!previewMode && ( // Show submit button only when not in preview mode
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-full font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-300
                        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} font-header`}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'} {/* Changed text */}
                    </button>
                  )}
                </div>
              </form>
            )
          ) : ( // Display message if no ID is present (not in edit mode)
            <div className="text-center py-10 text-gray-600 font-content text-xl">
                <p className="mb-4">No idea selected for editing.</p>
                <p>Please select an idea from the table below to view and manage its details.</p>
            </div>
          )}
        </div>

        {/* --- All Submitted Ideas Table --- */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-12 p-6 md:p-10 lg:p-12">
          <h2 className="text-3xl md:text-4xl font-header font-bold text-[#7b2c2c] mb-8 text-center">
            All Submitted Ideas
          </h2>
          {loadingAllIdeas ? (
            <div className="text-center text-gray-600 font-content py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              Loading submitted ideas...
            </div>
          ) : errorFetchingAllIdeas ? (
            <p className="p-4 text-center text-red-600 font-content text-lg">{errorFetchingAllIdeas}</p>
          ) : allIdeas.length === 0 ? (
            <p className="p-4 text-center text-gray-600 font-content text-lg">No ideas have been submitted yet.</p>
          ) : (
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-header">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">E. Code</th>
                    <th scope="col" className="px-6 py-3">Employee Name</th>
                    <th scope="col" className="px-6 py-3">Occasion</th>
                    <th scope="col" className="px-6 py-3">Question</th>
                    <th scope="col" className="px-6 py-3">Idea</th>
                    <th scope="col" className="px-6 py-3">Submission Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Likes</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allIdeas.map((idea) => (
                    <tr key={idea.id} className="bg-white border-b hover:bg-gray-50 font-content">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {idea.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {idea.eCode || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {idea.senderName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {idea.occasion || 'N/A'}
                      </td>
                      <td className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={idea.question}>
                        {idea.question || 'N/A'}
                      </td>
                      <td className="px-6 py-4 max-w-md overflow-hidden text-ellipsis whitespace-nowrap" title={idea.messageBody}>
                        {idea.messageBody}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(idea.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            idea.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                            idea.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {idea.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {idea.likes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEditIdea(idea.id)}
                          className="font-medium text-blue-600 hover:underline mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteIdeaFromTable(idea.id)}
                          className="font-medium text-red-600 hover:underline mr-3"
                        >
                          Delete
                        </button>
                        {/* Add to Xcite Cards button */}
                        <button
                          onClick={() => handlePublishToXciteCards(idea.id)}
                          disabled={idea.status === 'PUBLISHED'} // Disable if already published
                          className={`font-medium text-purple-600 hover:underline ${
                            idea.status === 'PUBLISHED' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {idea.status === 'PUBLISHED' ? 'Added to Xcite' : 'Add to Xcite Cards'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ManageIdeasPage;
