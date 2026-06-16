import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { FiX, FiMail, FiAlertCircle } from "react-icons/fi";
import { emailService } from "../../services/emailService";
import { sendUnifiedEmails } from "../../services/cycleService";

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
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [originalTemplate, setOriginalTemplate] = useState(null);

  // Get template ID based on action type
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
      case "LAUNCH": return "Launch Cycle & Send Notification";
      case "CLOSE": return "Close Cycle & Send Notification";
      case "EXTEND": return "Extend Expiry Date & Send Notification";
      case "REMINDER": return "Send Reminder Notification";
      case "REOPEN": return "Reopen Cycle & Send Notification";
      default: return "Send Notification";
    }
  };

  // Get button text based on action type
  const getButtonText = () => {
    if (isSending) return "Sending...";
    
    switch(actionType) {
      case "LAUNCH": return "Launch & Notify";
      case "CLOSE": return "Close & Notify";
      case "EXTEND": return "Extend & Notify";
      case "REMINDER": return "Send Reminder";
      case "REOPEN": return "Reopen & Notify";
      default: return "Send Notification";
    }
  };

  // Get description text based on action type
  const getDescriptionText = () => {
    const quarterText = cycleQuarter || (cycleType === "ANNUAL" ? "Annual Review" : "Performance Review");
    
    switch(actionType) {
      case "LAUNCH":
        return `You are about to launch the ${quarterText} cycle. An email will be sent to ALL employees.`;
      case "CLOSE":
        return `You are about to close the ${quarterText} cycle. A closure notification will be sent to ALL employees.`;
      case "EXTEND":
        return `You are about to extend the expiry date to ${newExpiryDate}. A notification will be sent to ALL employees.`;
      case "REMINDER":
        return `A reminder email will be sent to ALL employees who haven't completed their ${quarterText} review.`;
      case "REOPEN":
        return `You are about to reopen the ${quarterText} cycle with new expiry date ${newExpiryDate}. A notification will be sent to ALL employees.`;
      default:
        return `A notification will be sent to ALL employees.`;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError("");
      fetchTemplateFromDatabase();
    }
  }, [isOpen, actionType, cycleId]);

  const fetchTemplateFromDatabase = async () => {
    try {
      setIsLoading(true);
      const templateId = getTemplateIdByAction();
      console.log(`Fetching template for action ${actionType} with ID: ${templateId}`);
      
      const response = await emailService.previewTemplateById(templateId);
      if (response.data) {
        const template = response.data;
        setOriginalTemplate(template);
        setEmailSubject(template.subject || "");
        setEmailBody(template.body || "");
        console.log(`Template loaded successfully for ${actionType}`);
      }
    } catch (err) {
      console.error("Failed to load template:", err);
      setError(`Failed to load email template from database for ${actionType} action.`);
      setEmailSubject("");
      setEmailBody("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndLaunch = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setError("Email subject and body are required");
      return;
    }

    try {
      setIsSending(true);
      setError("");

      const emailData = {
        subject: emailSubject,
        body: emailBody,
        templateId: getTemplateIdByAction(),
      };

      // Call the onLaunch callback with the email data
      await onLaunch(emailData);
      
      // Close the modal only after successful launch
      onClose();
    } catch (err) {
      console.error("Error sending email:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send notification. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetToOriginal = () => {
    if (originalTemplate) {
      setEmailSubject(originalTemplate.subject || "");
      setEmailBody(originalTemplate.body || "");
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform rounded-xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <FiMail className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {getModalTitle()}
              </h2>
            </div>
            <button onClick={onClose} disabled={isSending} className="p-1 hover:bg-gray-100 rounded-full">
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Info Box */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-700">Action: {actionType}</p>
                  <p className="text-md font-medium text-gray-800 mt-1">
                    {cycleQuarter || cycleType} {cycleQuarter ? `- ${cycleType}` : ''}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
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

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Subject <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleResetToOriginal}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Reset to Original
                      </button>
                    </div>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={isSending}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available variables: &#123;&#123;employeeName&#125;&#125;, &#123;&#123;firstName&#125;&#125;, &#123;&#123;quarter&#125;&#125;, &#123;&#123;endDate&#125;&#125;, &#123;&#123;financialYear&#125;&#125;, &#123;&#123;newDate&#125;&#125;
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={12}
                      placeholder="Enter email body... Use {{employeeName}}, {{quarter}}, {{endDate}} as placeholders"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                      disabled={isSending}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Tip:</strong> Use &#123;&#123;employeeName&#125;&#125; to address each employee personally.
                      &#123;&#123;quarter&#125;&#125; will be replaced with the quarter name.
                      &#123;&#123;endDate&#125;&#125; will be replaced with the cycle end date.
                      &#123;&#123;newDate&#125;&#125; will be replaced with the new expiry date (for Extend/Reopen).
                    </p>
                  </div>
                </div>

                {/* Preview section */}
                {emailSubject && emailBody && (
                  <div className="border-t border-gray-200 pt-4">
                    <details>
                      <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                        Preview Email (Sample)
                      </summary>
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Subject: {emailSubject}</div>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">
                          {emailBody.substring(0, 300)}
                          {emailBody.length > 300 && "..."}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Note: Variables will be replaced with actual values when sending
                        </p>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndLaunch}
              disabled={isLoading || isSending || !emailSubject.trim() || !emailBody.trim()}
              className="min-w-[140px]"
            >
              {isSending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Sending...
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