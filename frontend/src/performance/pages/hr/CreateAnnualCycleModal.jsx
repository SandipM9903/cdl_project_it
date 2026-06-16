import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const CreateAnnualCycleModal = ({ isOpen, onClose, onSaveAnnual }) => {
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setExpiryDate("");
      setStatus("NOT_STARTED");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!expiryDate) {
      console.log("Validation failed: Expiry date is required");
      return;
    }

    const payload = {
      expiryDate,
      status,
    };

    console.log("Annual Modal - Sending payload:", payload);

    try {
      setLoading(true);
      await onSaveAnnual(payload);
      onClose();
    } catch (err) {
      console.error("Error creating annual cycle", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Annual Review Cycle"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!expiryDate || loading}
            className="bg-[#ef4444] hover:bg-[#dc2626] focus:ring-[#ef4444]"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      {/* Annual Review Selection */}
      <div className="flex gap-10 mb-8">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="radio"
            name="annualCycle"
            value="ANNUAL"
            checked={true}
            readOnly
            className="w-4 h-4 accent-[#ef4444]"
          />
          Annual Review
        </label>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-red-50 rounded-lg">
        <p className="text-sm text-red-700">
          <span className="font-semibold">Annual Review Period:</span>
        </p>
        <p className="text-xs text-red-600 mt-1">
          The annual performance review covers the complete financial year.
        </p>
      </div>

      {/* Expiry Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-opacity-20 focus:border-[#ef4444] transition-all duration-200"
        />
      </div>

      {/* Status */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-opacity-20 focus:border-[#ef4444] transition-all duration-200 bg-white"
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
    </Modal>
  );
};

export default CreateAnnualCycleModal;
