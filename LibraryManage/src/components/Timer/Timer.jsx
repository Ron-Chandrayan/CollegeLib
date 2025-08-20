import { useState, useEffect } from "react";

function Timer({ startTimeISO }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTimeISO){ 
        setElapsed(0);           // reset display
      return;  
    }; // do nothing if null

    const startTime = new Date(startTimeISO).getTime(); // ISO → epoch (ms)

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(now - startTime); // elapsed ms
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount or startTimeISO change
  }, [startTimeISO]);

  // Convert ms → hh:mm:ss
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

  const format = (n) => String(n).padStart(2, "0");

  return (
    <div>
      {format(hours)}:{format(minutes)}:{format(seconds)}
    </div>
  );
}

export default Timer;
