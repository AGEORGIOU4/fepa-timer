import React, { useState, useEffect, useRef } from "react";
import { CCol, CButton, CRow } from "@coreui/react-pro";

const TimerButton = ({ handleTimeButtonClick, time, selectedTime }) => {
  return (
    <CButton
      className="timer-button"
      onClick={() => handleTimeButtonClick(time)}
      style={{
        width: "50px",
        height: "50px",
        margin: "0 10px",
        backgroundColor: selectedTime === time ? "#777777" : "", selectedTime,
        scale: selectedTime === time ? "1.15" : "1"
      }}
    >
      {time}s
    </CButton>
  )
}

const ActionButtons = ({ resetShotClock, toggleShotClock, restartShotClock, selectedTime, isRunning }) => {
  return (
    <>
      <CButton
        onClick={() => resetShotClock(selectedTime)}
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          color: "white",
          width: "100px", // Make the button take up the full column width
          height: "100px",
          background: "#ef376e",
          borderRadius: "100%"
        }}
      >
        Reset
      </CButton>

      <CButton
        onClick={toggleShotClock} // Toggle start/pause
        style={{
          position: "absolute",
          right: 140,
          bottom: 20,
          color: "white",
          width: "100px", // Make the button take up the full column width
          height: "100px",
          background: isRunning ? "#ffc107" : "#51cc8a",
          borderRadius: "100%",
          scale: isRunning ? "0.9" : "1",
        }}
      >
        {isRunning ? "Pause" : "Start"}
      </CButton>

      <CButton
        disabled={!isRunning ? true : false}
        onClick={restartShotClock}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          color: "white",
          width: "100px", // Make the button take up the full column width
          height: "100px",
          background: "#007bff",
          borderRadius: "100%"
        }}
      >
        Restart
      </CButton>

    </>

  );
};

export const CShotClockLandscape = () => {
  const times = [60, 45, 30, 15];

  const [defaultTime, setDefaultTime] = useState(45); // Default to 60 seconds
  const [shotClock, setShotClock] = useState(defaultTime); // Default to 60 seconds
  const [timer, setTimer] = useState(null); // Timer reference
  const [isRunning, setIsRunning] = useState(false); // Track if the clock is running
  const [selectedTime, setSelectedTime] = useState(45); // Track the selected time

  const [p1ExtensionUsed, setP1ExtensionUsed] = useState(false);
  const [p2ExtensionUsed, setP2ExtensionUsed] = useState(false);

  const radius = 126;
  const circumference = 2 * Math.PI * radius;

  const beepSoundRef = useRef(new Audio('/6seconds.wav'));

  useEffect(() => {
    beepSoundRef.current.preload = "auto"; // Preload audio for faster playback
    beepSoundRef.current.crossOrigin = "anonymous"; // If hosted externally
  }, []);


  const getStrokeColor = (time) => {
    if (time > 15) {
      return "#51cc8a"; // Green for 45s-60s
    } else if (time > 5) {
      return "#ffc107"; // Green for 30s-45s
    } else {
      return "#ef376e"; // Red for 0s-15s
    }
  };

  const playBeepIfNeeded = (time) => {
    if (time <= 5) {
      beepSoundRef.current.play(); // Play the beep sound
    }
  };

  const pauseBeep = () => {
    beepSoundRef.current.pause();
  };

  const stopBeep = () => {
    beepSoundRef.current.pause();
    beepSoundRef.current.currentTime = 0;
  };

  const startShotClock = () => {
    const newTimer = setInterval(() => {
      setShotClock((prev) => {
        if (prev === 0) {
          clearInterval(newTimer); // Stop when it reaches 0
          return 0;
        }
        const newTime = prev - 1;
        playBeepIfNeeded(newTime); // Check and trigger beep if needed
        return newTime;
      });
    }, 1000);
    setTimer(newTimer); // Start the timer
  };

  const stopShotClock = () => {
    clearInterval(timer); // Stop the timer
    setTimer(null); // Clear the timer reference
  };

  const handleTimeButtonClick = (time) => {
    setSelectedTime(time); // Set the selected time
    resetShotClock(time); // Reset to the selected time
  };

  const toggleShotClock = () => {
    pauseBeep(); // Stop the beep sound if it's playing
    if (isRunning) {
      stopShotClock(); // Stop the timer
    } else {
      startShotClock(); // Start the timer
    }
    setIsRunning(!isRunning); // Toggle the clock state
  };

  const resetShotClock = (time) => {
    stopBeep(); // Stop the beep sound if it's playing
    setShotClock(time);
    stopShotClock(); // Clear the current timer
    setIsRunning(false); // Stop the clock when reset
    setP1ExtensionUsed(false); // Reset player 1 extension
    setP2ExtensionUsed(false); // Reset player 2 extension
  };

  const handleCircleClick = () => {
    toggleShotClock()
  };

  const restartShotClock = () => {
    stopBeep(); // Stop the beep sound if it's playing
    setShotClock(selectedTime);
    stopShotClock(); // Clear the current timer
    setIsRunning(false); // Stop the clock when reset
    startShotClock(); // Start the countdown immediately after reset
    setIsRunning(true); // Mark the clock as running
  };

  const handleP1Extension = () => {
    stopBeep();
    if (!p1ExtensionUsed) {
      setShotClock(prev => prev + 15);
      setP1ExtensionUsed(true);
    }
  };

  const handleP2Extension = () => {
    stopBeep(); // Stop the beep sound if it's playing
    if (!p2ExtensionUsed) {
      setShotClock(prev => prev + 15); // Add 15 seconds to the shot clock
      setP2ExtensionUsed(true); // Mark player 2 extension as used
    }
  };

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  useEffect(() => {
    return () => {
      pauseBeep();
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const [isRed, setIsRed] = useState(false); // State to toggle between colors

  useEffect(() => {
    if (shotClock <= 5) {
      const interval = setInterval(() => {
        setIsRed((prev) => !prev); // Toggle the color
      }, 200); // Change color every second
      return () => clearInterval(interval); // Clean up interval on unmount
    } else { setIsRed(false) }
  }, [shotClock]); // Empty dependency array to ensure it runs once on mount


  return (
    <>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "90vh" }}>
        <CRow className="text-center bold-text">
          <CCol sm={3} style={{ textAlign: "left" }}>
            <CButton
              onClick={handleP1Extension}
              disabled={p1ExtensionUsed} // Disable after use
              style={{
                margin: "30px 50px",
                width: "100px",
                height: "60px",
                color: "white",
                background: p1ExtensionUsed ? "#cccccc" : "#f97316", // Disabled color
              }}
            >
              P1 Extension
            </CButton>
          </CCol>
          <CCol sm={6} style={{ margin: "10px auto" }}>
            <svg
              width="280"
              height="280"
              onClick={handleCircleClick}
              style={{
                cursor: "pointer",
                margin: "0 20px",
                transition: "transform 0.2s ease",
                transform: isRunning ? "scale(0.95)" : "scale(1)",
              }}
            >
              <circle
                cx="140" // Adjusted for new size (half of 280)
                cy="140" // Adjusted for new size (half of 280)
                r="126" // Adjusted radius (135 was too large for the new size)
                stroke="lightgray"
                strokeWidth="12" // Adjusted stroke width for better proportions
                fill="none"
              />
              <circle
                cx="140" // Adjusted for new size
                cy="140" // Adjusted for new size
                r="126" // Adjusted radius
                stroke={getStrokeColor(shotClock)}
                strokeWidth="12" // Adjusted stroke width
                fill="dark"
                strokeDasharray={circumference} // Ensure this is updated if circumference depends on radius
                strokeDashoffset={((60 - shotClock) / 60) * circumference}
                transform="rotate(-90 140 140)" // Adjusted rotation pivot for new center
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize={shotClock < 10 ? "180" : "110"} // Adjusted for slightly larger size
                fill={isRed ? "#ef376e" : "white"} // Set fill color based on state
              >
                {shotClock}
              </text>
            </svg>

          </CCol>
          <CCol sm={3} style={{ textAlign: "right" }}>
            <CButton
              onClick={handleP2Extension}
              disabled={p2ExtensionUsed} // Disable after use
              style={{
                margin: "30px 50px",
                width: "100px",
                height: "60px",
                color: "white",
                background: p2ExtensionUsed ? "#cccccc" : "#f97316", // Disabled color
              }}
            >
              P2 Extension
            </CButton>
          </CCol>


          <div style={{ width: "100%", textAlign: "center" }}>
            {times?.map((time, index) => {
              return (
                <TimerButton key={time} handleTimeButtonClick={handleTimeButtonClick} time={time} selectedTime={selectedTime} />
              )
            })}
          </div>
        </CRow>
      </div>

      <ActionButtons resetShotClock={resetShotClock} toggleShotClock={toggleShotClock} restartShotClock={restartShotClock}
        selectedTime={selectedTime} isRunning={isRunning} />
    </>

  );
};
