import React, { useState } from "react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

const ExtendExpiryModal = ({ isOpen, onClose, onExtend, currentExpiryDate, isReopen = false }) => {
  const [expiryDate, setExpiryDate] = useState(currentExpiryDate || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!expiryDate) {
      alert("Please select an expiry date");
      return;
    }

    setLoading(true);
    try {
      await onExtend(expiryDate);
      onClose();
    } catch (error) {
      console.error("Error extending expiry date:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isReopen ? "Re-open Quarter" : "Extend Expiry Date"}>
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Expiry Date
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {isReopen && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              This will re-open the quarter and change its status to ACTIVE.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : isReopen ? "Re-open Quarter" : "Extend Expiry Date"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExtendExpiryModal;