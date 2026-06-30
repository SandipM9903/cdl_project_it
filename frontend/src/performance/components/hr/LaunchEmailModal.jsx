import React, { useState } from "react";
import Button from "../../components/common/Button";
import { FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const LaunchEmailModal = ({
  isOpen,
  onClose,
  onLaunch,
  cycleQuarter,
  cycleType,
  cycleId,
  actionType = "LAUNCH",
  newExpiryDate = null,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Get template ID based on action type (kept for callback compatibility if needed)
  const getTemplateIdByAction = () => {
    switch(actionType) {
      case "LAUNCH": return 1;
      case "CLOSE": return 5;
      case "EXTEND": return 6;
      case "REMINDER": return 8;
      case "REOPEN": return 7;
      default: return 1;
    }
  };

  // Get modal title based on action type
  const getModalTitle = () => {
    switch(actionType) {
      case "LAUNCH": return "Launch Cycle";
      case "CLOSE": return "Close Cycle";
      case "EXTEND": return "Extend Expiry Date";
      case "REMINDER": return "Send Reminder";
      case "REOPEN": return "Reopen Cycle";
      default: return "Confirm Action";
    }
  };

  // Get button text based on action type
  const getButtonText = () => {
    if (isSending) return "Processing...";
    
    switch(actionType) {
      case "LAUNCH": return "Launch";
      case "CLOSE": return "Close";
      case "EXTEND": return "Extend";
      case "REMINDER": return "Send Reminder";
      case "REOPEN": return "Reopen";
      default: return "Confirm";
    }
  };

  // Get description text based on action type
  const getDescriptionText = () => {
    const quarterText = cycleQuarter || (cycleType === "ANNUAL" ? "Annual Review" : "Performance Review");
    
    switch(actionType) {
      case "LAUNCH":
        return `You are about to launch the ${quarterText} cycle.`;
      case "CLOSE":
        return `You are about to close the ${quarterText} cycle.`;
      case "EXTEND":
        return `You are about to extend the expiry date to ${newExpiryDate}.`;
      case "REMINDER":
        return `A reminder will be sent to all employees who haven't completed their ${quarterText} review.`;
      case "REOPEN":
        return `You are about to reopen the ${quarterText} cycle with new expiry date ${newExpiryDate}.`;
      default:
        return `Are you sure you want to perform this action?`;
    }
  };

  const handleSaveAndLaunch = async () => {
    try {
      setIsSending(true);
      setError("");

      const emailData = {
        subject: "",
        body: "",
        templateId: getTemplateIdByAction(),
      };

      // Call the onLaunch callback
      await onLaunch(emailData);
      
      // Close the modal only after successful launch
      onClose();
    } catch (err) {
      console.error("Error performing action:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to complete action. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {getModalTitle()}
              </h2>
            </div>
            <button onClick={onClose} disabled={isSending} className="p-1 hover:bg-gray-100 rounded-full">
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700">Action: {actionType}</p>
                <p className="text-md font-medium text-gray-800 mt-1">
                  {cycleQuarter || (cycleType === "ANNUAL" ? "Annual" : cycleType)} {cycleQuarter && cycleType ? `- ${cycleType}` : ''}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-normal leading-relaxed">
                  {getDescriptionText()}
                </p>
                {newExpiryDate && (actionType === "EXTEND" || actionType === "REOPEN") && (
                  <p className="text-sm font-semibold text-blue-700 mt-2">
                    📅 New Expiry Date: {newExpiryDate}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndLaunch}
              disabled={isSending}
              className="min-w-[120px]"
            >
              {isSending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : (
                getButtonText()
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchEmailModal;