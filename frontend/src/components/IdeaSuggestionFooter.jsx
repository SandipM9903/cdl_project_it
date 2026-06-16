import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './IdeaSuggestionFooter.css'; // Assuming this CSS file exists
import axios from 'axios';
import { BASE_URL } from '../config/Config'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { X, ThumbsUp, MessageCircle } from 'lucide-react'; // Import X, ThumbsUp, MessageCircle icons

const IdeaSuggestionFooter = () => {
  const [ideaText, setIdeaText] = useState("");
  const [suggestionText, setSuggestionText] = useState("");

  const [isSendingIdea, setIsSendingIdea] = useState(false);
  const [hasSentIdea, setHasSentIdea] = useState(false);
  const [isSendingSuggestion, setIsSendingSuggestion] = useState(false);  
  const [hasSentSuggestion, setHasSentSuggestion] = useState(false);

  // State to store dynamically fetched ideas for cards (filtered for "published")
  const [dynamicXciteIdeas, setDynamicXciteIdeas] = useState([]);
  const [loadingDynamicXciteIdeas, setLoadingDynamicXciteIdeas] = useState(true);
  const [errorDynamicXciteIdeas, setErrorDynamicXciteIdeas] = useState(null);

  // New states to hold the dynamic occasion and question for the main section text
  const [currentXciteOccasion, setCurrentXciteOccasion] = useState('Independence Day'); // Default changed
  const [currentXciteQuestion, setCurrentXciteQuestion] = useState('"What IF" India in 2047 could see us today?'); // Default changed

  // Modal states for displaying full idea content
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  
  // States for like and comment functionality within the modal
  const [hasLikedSelectedIdea, setHasLikedSelectedIdea] = useState(false);
  const [ideaComments, setIdeaComments] = useState([]);
  const [newIdeaCommentText, setNewIdeaCommentText] = useState('');
  const [isSubmittingIdeaComment, setIsSubmittingIdeaComment] = useState(false);

  // NEW: State and Ref for auto-scrolling
  const scrollContainerRef = useRef(null);
  const [isScrollingPaused, setIsScrollingPaused] = useState(false);
  const scrollSpeed = 1.5; // Pixels per interval step
  const scrollIntervalTime = 50; // Milliseconds per interval step


  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("firstName");
  
 
  const userEmpCode = localStorage.getItem("empId"); 
 
  const xciteEligibleEmpCodes = ["9085176", "9086618", "7736"];
  
  const showManageIdeasButton = xciteEligibleEmpCodes.includes(userEmpCode);

  
  const fetchIdeasForXciteCards = async () => {
    setLoadingDynamicXciteIdeas(true);
    setErrorDynamicXciteIdeas(null);
    try {
     
      const response = await axios.get(`${BASE_URL}:9039/api/celebration/ideas`);
      
      // --- DEBUGGING LOGS (keep for development, remove for production) ---
      console.log("FETCHED IDEAS - RAW DATA (before filtering for display):", response.data);
      console.log("Total ideas fetched from backend (before filtering for display):", response.data.length);
      // --- END DEBUGGING LOGS ---

      if (response.status === 200) {
       
        const filteredIdeas = response.data.filter(idea => idea.status === 'PUBLISHED');
        
        // --- DEBUGGING LOGS (keep for development, remove for production) ---
        console.log("FILTERED IDEAS - AFTER LOGIC (ONLY PUBLISHED):", filteredIdeas);
        console.log("Number of ideas after filtering (should be visible):", filteredIdeas.length);
        // --- END DEBUGGING LOGS ---

        setDynamicXciteIdeas(filteredIdeas);

        // Set the occasion and question for the main section from the first published idea
        if (filteredIdeas.length > 0) {
          setCurrentXciteOccasion(filteredIdeas[0].occasion || 'Independence Day');
          setCurrentXciteQuestion(filteredIdeas[0].question || '"What IF" India in 2047 could see us today?');
        } else {
          // Fallback to default if no published ideas are found
          setCurrentXciteOccasion('Independence Day');
          setCurrentXciteQuestion('"What IF" India in 2047 could see us today?');
        }

      } else {
        toast.warn("Failed to fetch ideas for Xcite section. Please try again.");
        console.warn("Backend responded with non-200 status for Xcite ideas:", response);
        setErrorDynamicXciteIdeas("Failed to load ideas for display.");
      }
    } catch (error) {
      console.error("Error fetching Xcite ideas:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : "Network error or internal server error.";
      toast.error(`Error fetching Xcite ideas: ${errorMessage}`);
      setErrorDynamicXciteIdeas(`Error fetching Xcite ideas: ${errorMessage}`);
    } finally {
      setLoadingDynamicXciteIdeas(false);
    }
  };

  // Fetch dynamic Xcite ideas when the component mounts or when an idea is submitted from this page
  useEffect(() => {
    fetchIdeasForXciteCards();
  }, []); // Run once on mount

  // NEW: Auto-scrolling effect for idea cards
  useEffect(() => {
    let scrollInterval;

    const startScrolling = () => {
      if (scrollContainerRef.current) {
        scrollInterval = setInterval(() => {
          if (!isScrollingPaused) {
            const { current } = scrollContainerRef;
            // Scroll to the right
            current.scrollLeft += scrollSpeed;

            // If scrolled to the end, reset to beginning
            if (current.scrollLeft >= (current.scrollWidth - current.clientWidth)) {
              current.scrollLeft = 0;
            }
          }
        }, scrollIntervalTime);
      }
    };

    // Start scrolling only if there are enough items to scroll and not paused
    if (dynamicXciteIdeas.length > 3) { // Only scroll if there are more than 3 visible cards
      startScrolling();
    }

    return () => {
      clearInterval(scrollInterval); // Cleanup on component unmount
    };
  }, [dynamicXciteIdeas, isScrollingPaused, scrollSpeed, scrollIntervalTime]); // Re-run if ideas or pause state changes


  const handleSuggestionSubmit = async () => {
    if (!suggestionText.trim()) {
      toast.error("Please enter a suggestion before submitting.");
      return;
    }

    setIsSendingSuggestion(true);

    if (!userEmail || !userName) {
      toast.error('Your email or name is not available. Please log in again.');
      setIsSendingSuggestion(false);
      return;
    }

    const payload = {
      senderEmail: userEmail,
      senderName: userName,
      recipientEmail: "ceo@cms.co.in",
      recipientFullName: "CEO",
      messageBody: suggestionText.trim(),
      wishType: "SUGGESTION",
      ccEmail: userEmail
    };

    try {
      // Ensure BASE_URL includes the port if needed for this service
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/send-wish`, payload);

      if (response.status === 200) {
        toast.success("Suggestion sent successfully! Your CEO will review it. 🎉");
        setHasSentSuggestion(true);
        setSuggestionText("");
      } else {
        toast.warn("Failed to send suggestion. Please try again.");
        console.warn("Backend responded with non-200 status for suggestion:", response);
      }
    } catch (error) {
      console.error("Error sending suggestion:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : "Network error or internal server error.";
      toast.error(`Error sending suggestion: ${errorMessage}`);
    } finally {
      setIsSendingSuggestion(false);
    }
  };

  const handleIdeaSubmit = async () => {
    if (!ideaText.trim()) {
      toast.error("Please enter an idea before submitting.");
      return;
    }

    setIsSendingIdea(true);

    // Use userEmpCode here as well for consistency
    if (!userEmail || !userName || !userEmpCode) {
      toast.error('Your email, name, or employee code is not available. Please log in again.');
      setIsSendingIdea(false);
      return;
    }

    const payload = {
      senderEmail: userEmail,
      senderName: userName,
      eCode: userEmpCode, // Employee code from localStorage
      messageBody: ideaText.trim(),
      status: "PENDING", // New ideas start as PENDING by default
      wishType: "IDEA",
      recipientEmail: "happitude@cms.co.in", // Default recipient for idea submissions
      recipientFullName: "Happitude Team",
      ccEmail: userEmail,
     
      occasion: null, 
      question: null, 
    };

    try {
      // Ensure BASE_URL includes the port if needed for this service
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/send-wish`, payload);

      if (response.status === 200) {
        toast.success("Idea submitted successfully! The Happitude Team will review it. 💡");
        setHasSentIdea(true);
        setIdeaText("");
        
      } else {
        toast.warn("Failed to submit idea. Please try again.");
        console.warn("Backend responded with non-200 status for idea:", response);
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : "Network error or internal server error.";
      toast.error(`Error submitting idea: ${errorMessage}`);
    } finally {
      setIsSendingIdea(false);
    }
  };

  const handleCardClick = async (idea) => {
    setSelectedIdea(idea);
    setShowIdeaModal(true);
    
    // Fetch like status and comments when modal opens
    if (userEmpCode && idea.id) {
      try {
        // Ensure BASE_URL includes the port
        const likeCheckResponse = await axios.get(`${BASE_URL}:9039/api/celebration/ideas/${idea.id}/hasLiked?likerEcode=${userEmpCode}`);
        setHasLikedSelectedIdea(likeCheckResponse.data);
      } catch (error) {
        console.error("Error fetching like status:", error);
        setHasLikedSelectedIdea(false); // Assume not liked on error
      }
    } else {
      setHasLikedSelectedIdea(false); // If no user, or no idea ID
    }

    // Fetch comments for the selected idea
    try {
      // Ensure BASE_URL includes the port
      const commentsResponse = await axios.get(`${BASE_URL}:9039/api/celebration/ideas/${idea.id}/comments`);
      setIdeaComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIdeaComments([]); // Clear comments on error
    }
  };

  const handleCloseModal = () => {
    setShowIdeaModal(false);
    setSelectedIdea(null);
    setHasLikedSelectedIdea(false); // Reset like status
    setIdeaComments([]); // Clear comments
    setNewIdeaCommentText(''); // Clear comment input
  };

  // Handle Like/Unlike functionality for the idea in the modal
  const handleIdeaLikeToggle = async () => {
    if (!userEmpCode || !userName) {
      toast.error('Please log in to like an idea.');
      return;
    }
    if (!selectedIdea || !selectedIdea.id) {
      toast.error('No idea selected to like.');
      return;
    }

    try {
      // Ensure BASE_URL includes the port
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/ideas/${selectedIdea.id}/like`, {
        likerEcode: userEmpCode,
        likerName: userName,
      });

      // Backend returns true if liked, false if unliked
      const isLikedNow = response.data;
      setHasLikedSelectedIdea(isLikedNow);
      
      // Optimistically update likes count in the modal's selectedIdea state
      setSelectedIdea(prevIdea => ({ 
        ...prevIdea, 
        likes: isLikedNow ? (prevIdea.likes || 0) + 1 : Math.max(0, (prevIdea.likes || 0) - 1) 
      }));

      // Also update the likes count on the card in the main list
      setDynamicXciteIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === selectedIdea.id 
          ? { ...idea, likes: isLikedNow ? (idea.likes || 0) + 1 : Math.max(0, (idea.likes || 0) - 1) }
          : idea
      ));

      if (isLikedNow) {
        toast.success('Idea Liked!');
      } else {
        toast.info('Idea Unliked!');
      }
    } catch (err) {
      console.error('Error toggling idea like:', err);
      toast.error('Failed to toggle like. Please try again.');
    }
  };

  // Handle comment submission for the idea in the modal
  const handleIdeaCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newIdeaCommentText.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (!userEmpCode || !userName) {
      toast.error('Please log in to comment.');
      return;
    }
    if (!selectedIdea || !selectedIdea.id) {
      toast.error('No idea selected to comment on.');
      return;
    }

    setIsSubmittingIdeaComment(true);
    try {
      // Ensure BASE_URL includes the port
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/ideas/${selectedIdea.id}/comments`, {
        commenterEcode: userEmpCode,
        commenterName: userName,
        commentText: newIdeaCommentText.trim(),
      });
      toast.success('Comment added successfully!');
      setNewIdeaCommentText(''); // Clear input
      
      
      setIdeaComments(prevComments => [response.data, ...prevComments]); 
      
      // Optimistically update comments count on the selected idea in the modal
      setSelectedIdea(prevIdea => ({ 
        ...prevIdea, 
        commentsCount: (prevIdea.commentsCount || 0) + 1 
      }));

      // Also update the comments count on the card in the main list
      setDynamicXciteIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === selectedIdea.id 
          ? { ...idea, commentsCount: (idea.commentsCount || 0) + 1 }
          : idea
      ));

    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingIdeaComment(false);
    }
  };

  // Helper function to format date for comments (e.g., "5 mins ago")
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return `${seconds} seconds ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minutes ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} days ago`;
      
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); // Fallback to full date for older comments
    } catch (e) {
      console.error("Error formatting time ago:", e); // Add error logging for debugging
      return dateString;
    }
  };


  return (
    <section className="bg-[#DC3545] py-4 px-4">
      <ToastContainer position="top-right" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-1 mb-8 left-1/2 transform -translate-x-1/2 w-9/12 max-w-8xl">

        {/* 💡 Idea Section */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-2 mt-8 relative group justify-between">
            <div className="flex items-center">
              <h2 className="text-4xl font-semibold font-header text-white mr-2">
                Ideas That Xcite
              </h2>
              <div className="relative flex items-center">
                <div
                  className="bg-white text-black rounded-full w-4 h-4 text-xs flex items-center justify-center cursor-pointer hover:bg-red-600"
                  title="Info"
                >
                  i
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white text-gray-800 text-sm p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                  "Avoid from sharing content related to politics, sexual , religion or compensation here." Let's discuss innovative and productive ideas that can drive business growth, improve project outcomes, or enhance team collaboration. Whether it's a feature, a tool, or a new business area — your idea matters!
                </div>
              </div>
            </div>

            {/* + Manage Ideas Button - Visible only for specific empCodes and navigates */}
            {showManageIdeasButton && (
              <button
                onClick={() => navigate('/manage-ideas')}
                className="bg-black text-white px-4 py-2 rounded-full font-content hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                + Manage Ideas
              </button>
            )}
          </div>

          {/* Dynamic Occasion
          <p className="text-white font-content text-lg mb-2">
            Occasion: <span className="font-semibold">{currentXciteOccasion}</span>
          </p>
          {/* Dynamic Question */}
          {/* <p className="text-white font-content text-lg mb-2">
            Question: <span className="font-semibold">{currentXciteQuestion}</span>
          </p>
          <p className="text-white font-content text-xs mb-6">
            We’d like your responses to be imaginative and forward-thinking — something that envisions a truly futuristic India.
          </p>  */}

          <div className="relative mb-6">
            <input
              type="text"
              value={ideaText}
              onChange={(e) => { setIdeaText(e.target.value); setHasSentIdea(false); }}
              placeholder="Submit Your Idea to the Bulletin Board..."
              className="w-full p-4 rounded-full border border-gray-300 pr-32 focus:outline-none focus:ring-2 focus:ring-red-400 font-content"
            />
            <button
              onClick={handleIdeaSubmit}
              disabled={isSendingIdea || hasSentIdea || !ideaText.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-white px-6 py-2 font-content rounded-full transition-colors duration-200 ${
                (isSendingIdea || hasSentIdea || !ideaText.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-red-600'
              }`}
              style={{ backgroundColor: (isSendingIdea || hasSentIdea || !ideaText.trim()) ? '#A0AEC0' : '#000000' }}
            >
              {isSendingIdea ? 'Sending...' : hasSentIdea ? 'Submitted!' : 'Send'}
            </button>
          </div>

          {/* Display Dynamic Ideas in cards */}
          {loadingDynamicXciteIdeas ? (
            <p className="text-white text-center font-content mt-5">Loading ideas for Xcite section...</p>
          ) : errorDynamicXciteIdeas ? (
            <p className="text-red-300 text-center font-content mt-5">Error: {errorDynamicXciteIdeas}</p>
          ) : dynamicXciteIdeas.length === 0 ? (
            <p className="text-white text-center font-content mt-5">No published ideas yet. Be the first to submit one!</p>
          ) : (
            // Added ref and event handlers for auto-scrolling
            <div 
              ref={scrollContainerRef}
              className={`${dynamicXciteIdeas.length > 3 ? 'overflow-x-auto no-scrollbar' : ''} flex gap-4 flex-nowrap pb-2`}
              onMouseEnter={() => setIsScrollingPaused(true)}
              onMouseLeave={() => setIsScrollingPaused(false)}
            >
              {dynamicXciteIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white mt-5 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 flex flex-col justify-between w-56 h-32 cursor-pointer border border-gray-100" // Enhanced styling
                  onClick={() => handleCardClick(idea)} // Click to open modal
                >
                  {/* Reduced line-clamp from 2 to 3 to show more text on card before modal */}
                  <h4 className="font-semibold line-clamp-3 font-content text-gray-800 text-xs" title={idea.messageBody}>{idea.messageBody}</h4>
                  <div className="flex justify-between text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">💬 {idea.commentsCount || 0}</span>
                    <span className="flex items-center gap-1">👍 {idea.likes || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📬 Suggestion Box */}
        <div>
          <h2 className="text-4xl font-semibold mt-8 text-white font-header mb-9">Suggestion Box</h2>
          <textarea
            rows="6"
            value={suggestionText}
            onChange={(e) => { setSuggestionText(e.target.value); setHasSentSuggestion(false); }}
            placeholder="Is there anything we can do better as an employer? Let the CEO know!"
            className="w-full p-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 font-content"
          />
          <button
            onClick={handleSuggestionSubmit}
            disabled={isSendingSuggestion || hasSentSuggestion || !suggestionText.trim()}
            className={`mt-4 text-white px-6 py-3 rounded-full transition-colors duration-200 ${
              (isSendingSuggestion || hasSentSuggestion || !suggestionText.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-red-600'
            }`}
            style={{ backgroundColor: (isSendingSuggestion || hasSentSuggestion || !suggestionText.trim()) ? '#A0AEC0' : '#000000' }}
          >
            {isSendingSuggestion ? 'Sending...' : hasSentSuggestion ? 'Submitted!' : 'Send My Suggestion'}
          </button>
        </div>
      </div>

      {/* Idea Detail Modal */}
      {showIdeaModal && selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-4 border-red-500 transform scale-95 animate-scale-in">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors"
              title="Close"
            >
              <X size={24} />
            </button>

            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-header leading-tight">
              {selectedIdea.messageBody.split('\n')[0].length < 50 ? selectedIdea.messageBody.split('\n')[0] : 'Idea Detail'}
            </h3>


            <div className="text-gray-600 text-sm mb-6 border-b pb-4 border-gray-200">
                <p className="mb-1"><strong>Occasion:</strong> {selectedIdea.occasion || 'Independence Day'}</p>
                <p className="mb-1"><strong>Question:</strong> {selectedIdea.question || '"What IF" India in 2047 could see us today?'}</p>
                <p className="mb-1"><strong>Submitted By:</strong> {selectedIdea.senderName || 'N/A'} (E. Code: {selectedIdea.eCode || 'N/A'})</p>
                <p className="mb-1">
                  <strong>Date:</strong> {selectedIdea.submissionDate ? new Date(selectedIdea.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong> <span className={`font-semibold ${selectedIdea.status === 'PUBLISHED' ? 'text-green-600' : 'text-orange-600'}`}>{selectedIdea.status}</span>
                </p>
                
                
                <div className="flex items-center space-x-6 mt-4">
                  <button
                    onClick={handleIdeaLikeToggle}
                    className={`flex items-center text-lg font-medium transition-colors ${hasLikedSelectedIdea ? 'text-red-600' : 'text-gray-700 hover:text-red-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={hasLikedSelectedIdea ? 'Unlike' : 'Like'}
                    disabled={!userEmpCode || hasLikedSelectedIdea} // Disabled if not logged in OR already liked
                  >
                    <ThumbsUp size={20} className={`mr-1 ${hasLikedSelectedIdea ? 'fill-red-600' : 'fill-none'}`} />
                    <span>{selectedIdea.likes || 0} {hasLikedSelectedIdea ? 'Liked' : 'Like'}</span> {/* Text changes */}
                  </button>
                  <div className="flex items-center text-lg font-medium text-gray-700">
                    <MessageCircle size={20} className="mr-1 text-blue-600" />
                    <span>{selectedIdea.commentsCount || 0} Comments</span>
                  </div>
                </div>
            </div>

            <p className="text-gray-700 text-base leading-relaxed font-content whitespace-pre-wrap mb-8">
              {selectedIdea.messageBody} 
            </p>

            
            <form onSubmit={handleIdeaCommentSubmit} className="mb-8">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Add a Comment</h4>
              <textarea
                value={newIdeaCommentText}
                onChange={(e) => setNewIdeaCommentText(e.target.value)}
                placeholder="Write your comment..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              ></textarea>
              <button
                type="submit"
                disabled={isSubmittingIdeaComment || !newIdeaCommentText.trim() || !userEmpCode} // Disable if no text, or no user
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingIdeaComment ? 'Posting...' : 'Post Comment'}
              </button>
              {!userEmpCode && (
                <p className="text-red-500 text-sm mt-2">Please log in to post a comment.</p>
              )}
            </form>

            
            <h4 className="text-xl font-bold text-gray-800 mb-4">All Comments ({ideaComments.length})</h4>
            {ideaComments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-6">
                {ideaComments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <img
                        src={`https://placehold.co/40x40/C0C0C0/333333?text=${comment.commenterName ? comment.commenterName.charAt(0) : '?'}`}
                        alt={comment.commenterName || 'Anonymous'}
                        className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{comment.commenterName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{comment.commenterEcode}</p>
                      </div>
                      <p className="ml-auto text-xs text-gray-500">{formatTimeAgo(comment.commentedAt)}</p>
                    </div>
                    <p className="text-gray-700 text-sm pl-12">{comment.commentText}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default IdeaSuggestionFooter;
