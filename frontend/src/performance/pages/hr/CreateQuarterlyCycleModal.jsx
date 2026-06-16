import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Select from "../../components/common/Select";

const CreateQuarterlyCycleModal = ({
  isOpen,
  onClose,
  closedQuarters = [],
  onSaveQuarter,
}) => {
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [loading, setLoading] = useState(false);

  // Determine next quarter based on closed quarters
  const nextQuarter = useMemo(() => {
    if (closedQuarters.length === 0) return "Q1";

    const lastClosed = closedQuarters[closedQuarters.length - 1];
    const lastIndex = quarters.indexOf(lastClosed);

    if (lastIndex === -1 || lastIndex === 3) return null;

    return quarters[lastIndex + 1];
  }, [closedQuarters, quarters]);

  useEffect(() => {
    if (nextQuarter) {
      setSelectedQuarter(nextQuarter);
    } else {
      setSelectedQuarter("");
    }
  }, [nextQuarter]);

  useEffect(() => {
    if (isOpen) {
      setStatus("NOT_STARTED");
      setExpiryDate("");
      // Reset selected quarter if needed
      if (nextQuarter) {
        setSelectedQuarter(nextQuarter);
      } else {
        setSelectedQuarter("");
      }
    }
  }, [isOpen, nextQuarter]);

  const handleSave = async () => {
    if (!selectedQuarter || !expiryDate) return;

    const payload = {
      quarter: selectedQuarter,
      expiryDate,
      status,
    };

    try {
      setLoading(true);

      // Call parent → parent will call createCycle API
      await onSaveQuarter(payload);

      onClose();
    } catch (err) {
      console.error("Error creating quarter cycle", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a quarter is disabled (already exists or closed)
  const isQuarterDisabled = (quarter) => {
    // For this modal, we only allow adding the next quarter
    return quarter !== nextQuarter;
  };

  // Check if a quarter is already completed (for styling)
  const isQuarterCompleted = (quarter) => {
    return closedQuarters.includes(quarter);
  };

  return (
    <Modal
      title="Create Quarterly Financial Year"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedQuarter || !expiryDate || loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    >
      {/* Quarter Selection */}
      <div className="flex gap-10 mb-8">
        {quarters.map((q, index) => {
          const isEnabled = q === nextQuarter;
          const isCompleted = isQuarterCompleted(q);

          return (
            <label
              key={q}
              className={`flex items-center gap-2 text-sm font-medium ${
                isEnabled
                  ? "cursor-pointer text-gray-700"
                  : isCompleted
                  ? "cursor-not-allowed text-green-600"
                  : "cursor-not-allowed text-gray-400"
              }`}
            >
              <input
                type="radio"
                name="quarter"
                value={q}
                disabled={!isEnabled}
                checked={selectedQuarter === q}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-4 h-4 accent-red-500"
              />
              Quarter {index + 1}
              {isCompleted && (
                <span className="ml-1 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Next Quarter Info */}
      {nextQuarter && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-semibold">Next quarter to add:</span> {nextQuarter}
          </p>
          {closedQuarters.length > 0 && (
            <p className="text-xs text-red-600 mt-1">
              Completed quarters: {closedQuarters.join(", ")}
            </p>
          )}
        </div>
      )}

      {!nextQuarter && closedQuarters.length === 4 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            All quarters have been completed for this financial year.
          </p>
        </div>
      )}

      {/* Expiry Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
        />
      </div>

      {/* Status */}
      <div>
        <Select
          label="Status"
          value={status}
          onChange={(val) => setStatus(val)}
          options={[
            { label: "Not Started", value: "NOT_STARTED" },
            { label: "Active", value: "ACTIVE" },
            { label: "Closed", value: "CLOSED" },
          ]}
        />
      </div>
    </Modal>
  );
};

export default CreateQuarterlyCycleModal;