import React, { useState } from 'react';

const TermsPopup = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    if (!isChecked) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('Error in TermsPopup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4 font-content">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900 font-header">
            WELCOME TO CMS DIGITAL LOUNGE
          </h2>
          <p className="text-gray-600 text-sm mt-1 font-content">
            Employee Compliance Acknowledgement
          </p>
        </div>

        <div className="p-6 md:p-8 font-content">
          
          {/* Intro Section */}
          <div className="mb-8">
            <div className="bg-red-50 border border-blue-200 rounded-lg p-5 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed font-content">
                We are pleased to onboard you onto the CDL platform. To maintain a 
                compliant and secure work environment, all new users are required to 
                review and acknowledge the company's key policies before accessing 
                the system.
              </p>
            </div>

            {/* Employee Declaration */}
            <div className="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-r-lg">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center font-header">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Employee Declaration
              </h3>

              <div className="text-gray-700 space-y-3 font-content">
                <p className="leading-relaxed font-content text-xs">
                  I hereby confirm that I have read, understood, and fully accept 
                  all the terms and conditions established by CMS.
                </p>

                <p className="font-content text-xs">
                  These terms also cover the related policies and compliance requirements, 
                  including but not limited to:
                </p>

                <ul className="list-disc space-y-1 pl-10 font-content text-xs">
                  <li>Code of Conduct and Business Ethics</li>
                  <li>Information Security and Data Protection standards</li>
                  <li>Background Verification norms and procedures</li>
                  <li>Confidentiality and Non-Disclosure obligations</li>
                  <li>Disciplinary guidelines and workplace policies</li>
                </ul>

                <p className="font-semibold text-gray-900 pt-3 border-t border-gray-200 mt-3 font-content text-xs">
                  I agree to always comply with these policies and requirements during 
                  my employment with the organization.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-8">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms-agreement"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500 focus:ring-2 mt-1"
              />

              <div className="ml-4">
                <label 
                  htmlFor="terms-agreement"
                  className="text-gray-800 font-bold cursor-pointer block mb-1 font-header text-sm"
                >
                  I Agree & Accept
                </label>

                <p className="text-gray-600 text-xs font-content">
                  By checking this box, I acknowledge that I have read, understood, 
                  and agree to comply with all the terms, conditions, and policies 
                  mentioned above.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <div className="text-sm text-gray-500 font-content text-xs">
              <p>This acknowledgement will be recorded in your employee profile.</p>
              <p className="mt-1">You will not be prompted to accept these terms again.</p>
            </div>

            <button
              onClick={handleProceed}
              disabled={!isChecked || isLoading}
              className={`
                px-8 py-3 rounded-lg font-bold text-lg min-w-[150px]
                transition-all duration-200 relative overflow-hidden text-sm
                font-header
                ${isChecked && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center font-header">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Proceed to Platform'}
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-content">
              <strong>Note:</strong> This is a one-time mandatory compliance acknowledgement. 
              Any violation of the accepted policies may result in disciplinary action 
              as per company guidelines.
            </p>
            <p className="text-xs text-gray-400 mt-2 font-content">
              © CMS DIGITAL LOUNGE. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsPopup;
