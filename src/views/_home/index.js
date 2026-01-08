import React, { useEffect, useState } from "react";
import { CShotClock } from "./components/shot-clock";
import InstallPWAButton from "../../components/InstallPWAButton";
import { CShotClockLandscape } from "./components/shot-clock-landscape";
import PWAPrompt from "react-ios-pwa-prompt";

const Home = () => {
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);


  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    // Add event listener for orientation changes
    window.addEventListener("resize", handleOrientationChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return (
    <>


      {/* <CImage style={{ position: 'absolute', top: 10, right: 10, width: '80px' }} src="fepa-logo.png" /> */}
      <div
        className="min-vh-100 gradient-background"
        style={{
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          overflow: "hidden", // Prevent scrollbars
          display: "flex", // Flexbox for layout
          flexDirection: "column", // Stack children vertically
          WebkitOverflowScrolling: "touch", // Smooth scrolling (fallback for content that might scroll inside)
        }}
      >

        {/* {isLandscape ? <CShotClockLandscape /> : <CShotClock />} */}
        {isLandscape ? <p>Only available on mobile devices</p> : <CShotClock />}
        <PWAPrompt promptOnVisit={1} timesToShow={3} delay={1500} copyClosePrompt="Close" />
        <InstallPWAButton />
      </div>
    </>
  );
};

export default Home;
