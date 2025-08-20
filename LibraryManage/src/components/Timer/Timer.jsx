import { useState, useEffect } from "react";

function Timer({ startTimeISO }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = new Date(startTimeISO).getTime(); // convert ISO → epoch (ms)

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(now - startTime); // elapsed time in ms
    }, 1000);

    return () => clearInterval(interval);
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
