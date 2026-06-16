import React, { useRef } from "react";

const CertificateGenerator = () => {
  const canvasRef = useRef(null);

  const empId = localStorage.getItem("empId");
  const firstName = localStorage.getItem("firstName");
  const name = firstName && empId ? `${firstName} (${empId})` : "Participant";

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.src = process.env.PUBLIC_URL + "/certificate-template.jpg";

    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // ✅ Adjusted: Name Placement (moved from 430 → 500)
      ctx.font = "30px 'Lucida Handwriting', cursive";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width / 2, 560); // <- updated here

      // ✅ Adjusted: Date Placement (moved from 540 → 620)
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      const today = new Date().toLocaleDateString("en-IN");
      ctx.fillText(today, 240, 800); // <- updated here

      const safeFileName = name.replace(/\s+/g, "_").replace(/[^\w()]/g, "");
      const link = document.createElement("a");
      link.download = `Certificate-${safeFileName}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    };
  };

  return (
    <div className="text-center mt-6">
      <canvas
        ref={canvasRef}
        width={768}
        height={1085}
        style={{ display: "none" }}
      />
      <button
        onClick={downloadCertificate}
        className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold"
      >
        🎓 Download Certificate
      </button>
    </div>
  );
};

export default CertificateGenerator;
