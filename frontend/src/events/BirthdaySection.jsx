import React, { useState, useEffect } from "react";
import birthdaytemplate5 from "../assets/birthdaytemplate5.webp";
import birthdaytemplate4 from "../assets/birthdaytemplate4.jpg";
import birthdaytemplate3 from "../assets/birthdaytemplate3.jpg";
import birthdaytemplate2 from "../assets/birthdaytemplate2.avif";
import birthdaytemplate1 from "../assets/birthdaytemplate1.jpg";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config/Config';

const cardTemplates = [
  { id: 1, src: birthdaytemplate1, alt: "Card 1" },
  { id: 2, src: birthdaytemplate2, alt: "Card 2" },
  { id: 3, src: birthdaytemplate3, alt: "Card 3" },
  { id: 4, src: birthdaytemplate4, alt: "Card 4" },
  { id: 5, src: birthdaytemplate5, alt: "Card 5" },
];

const BirthdaySection = () => {
  const [selectedCard, setSelectedCard] = useState(cardTemplates[0]);
  const location = useLocation();
  const employee = location.state?.employee;

  const [message, setMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [hasWished, setHasWished] = useState(false);

  useEffect(() => {
    if (employee?.fullNameAsAadhaar) {
      setMessage(`Happy Birthday ${employee.fullNameAsAadhaar}!`);
      setHasWished(false);
    } else {
      setMessage('');
    }
  }, [employee]);

  const handleReset = () => {
    setSelectedCard(cardTemplates[0]);
    setMessage(`Happy Birthday ${employee?.fullNameAsAadhaar || ''}!`);
    setHasWished(false);
  };

  const handleSendWishes = async () => {
    setIsSending(true);

    const senderEmail = localStorage.getItem('email');
    const senderName = localStorage.getItem('firstName'); // Ensure this matches your localStorage key for full name

    if (!senderEmail || !senderName) {
      toast.error('Your email or name is not available. Please log in again.');
      console.error('Sender email or name missing from localStorage.');
      setIsSending(false);
      return;
    }

    if (!employee || !employee.emailId || !employee.fullNameAsAadhaar) {
      toast.error('Recipient employee details are missing. Cannot send wish.');
      console.error('Recipient employee details (emailId or fullNameAsAadhaar) are missing.');
      setIsSending(false);
      return;
    }

    const payload = {
      senderEmail: senderEmail,
      senderName: senderName,
      recipientEmail: employee.emailId,
      recipientFullName: employee.fullNameAsAadhaar,
      messageBody: message,
      wishType: 'BIRTHDAY',
    };

    try {
      const response = await axios.post(`${BASE_URL}:9039/api/celebration/send-wish`, payload);

      if (response.status === 200) {
        // Changed success toast message to "Wished!"
        toast.success('Wished! 🎉');
        setHasWished(true);
      } else {
        toast.warn(`Failed to send wish to ${employee.fullNameAsAadhaar}.`);
        console.warn('Backend responded with non-200 status:', response);
      }
    } catch (error) {
      console.error('Error sending birthday wish:', error);
      const errorMessage = error.response && error.response.data
                           ? error.response.data
                           : 'Please check your network and try again.';
      toast.error(`Error sending wish: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 mt-20 sm:px-6 md:px-10 lg:px-16 py-6">
        <div className="text-sm text-[#777] font-medium mb-2">
          Home / <span className="text-black">Birthday wishes</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">Birthday wishes</h2>

        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start bg-gray-100 rounded-r-lg">
          {/* Left - Card Preview with Message Overlay */}
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
                className="rounded-lg h-80 max-w-full object-contain"
              />
              {/* Message overlay on top of the image */}
              <div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center px-4"
                style={{ pointerEvents: "none" }}
              >
                <p className="text-black text-sm break-words max-w-[150px]">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Card Selection + Message Input + Buttons */}
          <div className="p-4 sm:p-6 rounded-xl w-full">
            <h3 className="text-base font-semibold mb-2">Select your card</h3>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {cardTemplates.map((card) => (
                <img
                  key={card.id}
                  src={card.src}
                  alt={card.alt}
                  onClick={() => setSelectedCard(card)}
                  className={`h-54 w-20 object-cover rounded-lg border-2 cursor-pointer ${
                    selectedCard.id === card.id
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold mb-1">Write your message</h3>
              <textarea
                className="w-full border rounded-lg p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Add your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end mt-4 flex-wrap">
              <button
                onClick={handleReset}
                className="px-4 py-2 border rounded-full text-red-500 border-red-500 hover:bg-red-50"
              >
                Reset
              </button>
              <button
                onClick={handleSendWishes}
                disabled={isSending || hasWished}
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
      <ToastContainer/>
    </>
  );
};

export default BirthdaySection;