import React, { useState } from "react";

export default function TourBooking() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    destination: "",
    startDate: "",
    endDate: "",
    purpose: "Official"
  });


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://43.204.42.69:9082/api/v1/tour-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    alert("Tour booking submitted successfully!");
    console.log("Saved:", data);
    setShowModal(false);
  } catch (error) {
    console.error("Error saving booking:", error);
    alert("Error submitting tour booking");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  return (
    <div>
    

      {/* Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Book a Tour
      </button>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Book Official Tour
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  readOnly
                  className="w-full border border-gray-300 bg-gray-100 rounded-md px-4 py-2 text-gray-700 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
