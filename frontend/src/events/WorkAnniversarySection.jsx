import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Make sure this is imported somewhere in your app (e.g., App.js)
import { BASE_URL } from '../config/Config'; // Import BASE_URL

import workanniversary1 from "../assets/workanniversary1.jpg";
import workanniversary2 from "../assets/workanniversary2.jpg";
import workanniversary3 from "../assets/workanniversary3.jpg";
import workanniversary4 from "../assets/workanniversary4.webp";
import workanniversary5 from "../assets/workanniversary5.jpg";
import Header from '../components/Header';

const cardTemplates = [
  { id: 1, src: workanniversary1, alt: "Card 1" },
  { id: 2, src: workanniversary2, alt: "Card 2" },
  { id: 3, src: workanniversary3, alt: "Card 3" },
  { id: 4, src: workanniversary4, alt: "Card 4" },
  { id: 5, src: workanniversary5, alt: "Card 5" },
];

const WorkAnniversarySection = () => {
  const location = useLocation();
  const employee = location.state?.employee;

  const email = employee?.emailId; // or employee?.emailAddress or actual email field name
  console.log("employee Emaill: " + email); // Keep original console log
  const fullName =
    employee?.fullNameAsAadhaar ||
    `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim();
  const yearsCompleted = Math.floor(parseFloat(employee?.expWithCurrentCompany)) || 0;

  const [selectedCard, setSelectedCard] = useState(cardTemplates[0]);
  const [message, setMessage] = useState("");

  // State to manage the disabled state of the "Send Wishes" button
  const [isSending, setIsSending] = useState(false); // To prevent multiple clicks
  const [hasWished, setHasWished] = useState(false); // To disable after successful wish

  // Prepopulate message when component loads or employee data changes
  useEffect(() => {
    if (fullName && yearsCompleted) {
      setMessage(
        `🎉 Congratulations ${fullName}!\n${yearsCompleted} year${yearsCompleted !== 1 ? "s" : ""} completed at work!`
      );
      setHasWished(false); // Reset hasWished state if employee changes
    } else {
      setMessage(''); // Clear message if no employee data
    }
  }, [fullName, yearsCompleted, employee]); // Added employee to dependency array

  const handleReset = () => {
    setSelectedCard(cardTemplates[0]);
    setMessage(
      `🎉 Congratulations ${fullName}!\n${yearsCompleted} year${yearsCompleted !== 1 ? "s" : ""} completed at work!`
    );
    setHasWished(false); // Allow re-wishing after reset
  };

  /**
   * Handles sending the work anniversary wish to the backend.
   * Fetches sender details from localStorage and constructs the request.
   */
  const handleSendWishes = async () => {
    setIsSending(true); // Disable button immediately to prevent double-click

    // Get sender's details from localStorage
    const senderEmail = localStorage.getItem('email');
    const senderName = localStorage.getItem('firstName'); // Use 'fullName' as per backend DTO

    if (!senderEmail || !senderName) {
      toast.error('Your email or name is not available. Please log in again.');
      console.error('Sender email or name missing from localStorage.');
      setIsSending(false); // Re-enable button on error
      return;
    }

    if (!employee || !employee.emailId || !employee.fullNameAsAadhaar) {
      toast.error('Recipient employee details are missing. Cannot send wish.');
      console.error('Recipient employee details (emailId or fullNameAsAadhaar) are missing.');
      setIsSending(false); // Re-enable button on error
      return;
    }

    // Construct the data payload for the backend
    const payload = {
      senderEmail: senderEmail,
      senderName: senderName,
      recipientEmail: employee.emailId,
      recipientFullName: employee.fullNameAsAadhaar,
      messageBody: message, // Use the current message from the textarea
      wishType: 'ANNIVERSARY', // Set wish type to ANNIVERSARY
      yearsOfService: yearsCompleted, // Pass years completed for anniversary template
    };

    try {
      // Send the POST request to the backend
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/send-wish`, payload);

      if (response.status === 200) {
        toast.success('Wished! 🎉'); // Show "Wished!" toast on success
        setHasWished(true); // Disable the button permanently for this employee until reset/new employee
      } else {
        toast.warn(`Failed to send wish to ${employee.fullNameAsAadhaar}.`);
        console.warn('Backend responded with non-200 status:', response);
      }
    } catch (error) {
      console.error('Error sending work anniversary wish:', error);
      const errorMessage = error.response && error.response.data
                           ? error.response.data
                           : 'Please check your network and try again.';
      toast.error(`Error sending wish: ${errorMessage}`);
    } finally {
      setIsSending(false); // Always re-enable the button if an error occurs, or if not `hasWished`
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 mt-20 sm:px-6 md:px-10 lg:px-16 py-6">
        <div className="text-sm text-[#777] font-medium mb-2">
          Home / <span className="text-black">Work Anniversaries</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">Work Anniversaries Wishes</h2>

        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start bg-gray-100 rounded-r-lg">
          {/* Left - Card Preview */}
          <div
            className="flex justify-center items-center shrink-0 relative"
            style={{
              width: "380px",
              height: "488px",
              backgroundColor: "#DC3545",
              borderTopRightRadius: "38px",
              borderBottomRightRadius: "38px",
            }}
          >
            <div className="relative">
              <img
                src={selectedCard.src}
                alt="Selected Card"
                className="rounded-lg h-80 max-w-full object-contain" />

              {/* Custom Message Overlay */}
              <div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center px-4"
                style={{ pointerEvents: "none" }}
              >
                <p className="text-black text-sm break-words whitespace-pre-line max-w-[140px]">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Card Selection + Message */}
          <div className="p-4 sm:p-6 rounded-xl w-full">
            <h3 className="text-base font-semibold mb-2">Select your card</h3>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {cardTemplates.map((card) => (
                <img
                  key={card.id}
                  src={card.src}
                  alt={card.alt}
                  onClick={() => setSelectedCard(card)}
                  className={`h-54 w-20 object-cover rounded-lg border-2 cursor-pointer ${selectedCard.id === card.id
                      ? "border-red-500"
                      : "border-transparent"}`} />
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold mb-1">Write your message</h3>
              <textarea
                className="w-full border rounded-lg p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Add your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div className="flex gap-4 justify-end mt-4 flex-wrap">
              <button
                onClick={handleReset}
                className="px-4 py-2 border rounded-full text-red-500 border-red-500 hover:bg-red-50"
              >
                Reset
              </button>
              <button
                onClick={handleSendWishes} // Call the new handleSendWishes function
                disabled={isSending || hasWished} // Disable based on state
                className={`px-4 py-2 rounded-full text-white ${
                  isSending || hasWished ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
                style={{ backgroundColor: (isSending || hasWished) ? '#A0AEC0' : '#DC3545' }}
              >
                {isSending ? 'Sending...' : hasWished ? 'Wished!' : 'Send Wishes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkAnniversarySection;