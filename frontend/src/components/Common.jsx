import React, { useEffect, useState } from 'react';
import Header from './Header';
import Herosec from './herosec';
import { useLocation } from 'react-router-dom';
import TermsPopup from '../config/TearmsPopup';

export default function Common() {

  // Load chat widget once


  const location = useLocation();
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingTerms, setCheckingTerms] = useState(true);
  const [userEcode, setUserEcode] = useState(null);

  // Load ecode
  useEffect(() => {
    const ecode = localStorage.getItem('empId');
    if (ecode) {
      setUserEcode(ecode);
    } else {
      console.warn('No ecode found in localStorage');
      setIsLoading(false);
      setCheckingTerms(false);
    }
  }, []);

  // Check if user already accepted terms
  useEffect(() => {
    const checkTerms = async () => {
      if (!userEcode) {
        setIsLoading(false);
        setCheckingTerms(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await fetch(
          `http://43.205.24.208:9050/api/v1/terms/status?ecode=${userEcode}`
        );

        if (response.ok) {
          const data = await response.json();
          if (!data.hasAcceptedTerms) {
            setShowTermsPopup(true);
          }
        } else {
          // fallback localStorage
          const key = `cdl_terms_accepted_${userEcode}`;
          if (!localStorage.getItem(key)) setShowTermsPopup(true);
        }
      } catch (err) {
        console.error('Error checking terms:', err);
        const key = `cdl_terms_accepted_${userEcode}`;
        if (!localStorage.getItem(key)) setShowTermsPopup(true);
      } finally {
        setIsLoading(false);
        setCheckingTerms(false);
      }
    };

    if (userEcode) checkTerms();
  }, [userEcode]);


  // FINAL ACCEPT HANDLER (FullName included)
  const handleAcceptTerms = async () => {
    if (!userEcode) {
      alert('User not logged in. Cannot accept terms.');
      return;
    }

    try {
      const first = localStorage.getItem("firstName") || "";
      const last = localStorage.getItem("lastName") || "";
      const fullName = `${first} ${last}`.trim();

      const response = await fetch(
        `http://43.205.24.208:9050/api/v1/terms/accept?ecode=${userEcode}&fullName=${encodeURIComponent(fullName)}`,
        {
          method: 'POST'
        }
      );

      if (response.ok) {
        const data = await response.json();

        const key = `cdl_terms_accepted_${userEcode}`;
        localStorage.setItem(key, 'true');
        localStorage.setItem(`${key}_at`, new Date().toISOString());

        setShowTermsPopup(false);
        console.log('Terms accepted:', data);
      } else {
        console.warn('Backend failed. Saving locally...');
        const key = `cdl_terms_accepted_${userEcode}`;
        localStorage.setItem(key, 'true');
        setShowTermsPopup(false);
      }
    } catch (err) {
      console.error('Error accepting terms:', err);
      const key = `cdl_terms_accepted_${userEcode}`;
      localStorage.setItem(key, 'true');
      setShowTermsPopup(false);
    }
  };


  // Smooth scroll
  useEffect(() => {
    if (location.state?.scrollToBottom) {
      setTimeout(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }, 300);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow overflow-y-auto">
        <Herosec />
      </main>

      {!checkingTerms && userEcode && showTermsPopup && (
        <TermsPopup onAccept={handleAcceptTerms} />
      )}
    </div>
  );
}
