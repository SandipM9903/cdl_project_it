import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ videoUrl, onComplete, isActive, onProgress }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progressPercent = (video.currentTime / video.duration) * 100;
      onProgress(Math.floor(progressPercent));
    };

    const handleEnded = () => {
      onComplete();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete, onProgress]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        autoPlay={isActive}
        style={{ width: "100%", height: "360px", borderRadius: "10px" }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
