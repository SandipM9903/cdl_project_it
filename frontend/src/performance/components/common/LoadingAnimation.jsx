import React from 'react';
import { Atom } from 'react-loading-indicators';

const LoadingAnimation = ({ message = "" }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px 48px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Atom color="#DC2626" size={48} speedPlus={0} />
        <p style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, margin: 0 }}>
          {message || "Processing..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;