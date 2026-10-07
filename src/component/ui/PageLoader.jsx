import React, { useEffect, useState } from "react";
import mainContent from "../../constants/mainContent";

const PageLoader = ({ label = "Loading", duration, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(), 400); // wait for CSS fade out transition
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onComplete]);

  return (
    <div className={`whiold-loader-container ${!isVisible ? "whiold-loader-hidden" : ""}`}>
      <div className="whiold-loader-orb o1"></div>
      <div className="whiold-loader-orb o2"></div>

      <div className="whiold-loader-content">
        <div className="whiold-spinner">
          <div className="whiold-ring-outer"></div>
          <div className="whiold-ring-inner"></div>
          <div className="whiold-logo-wrap">
            <img className="whiold-logo-img" src={mainContent?.logo || "/favicon.png"} alt="Whiold" />
            <div className="whiold-logo-shimmer"></div>
          </div>
        </div>

        <div className="whiold-loader-status">
          <span>{label}</span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;