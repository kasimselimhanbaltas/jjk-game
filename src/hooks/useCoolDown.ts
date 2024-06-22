import { useEffect, useState } from "react";

function useCooldown(cooldownTime: number) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  const startCooldown = () => {
    setRemainingTime(cooldownTime);
  };

  return { remainingTime, startCooldown };
}
export default useCooldown;
