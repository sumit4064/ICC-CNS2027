import React, { useState, useEffect } from 'react';

export const Countdown = ({ targetDate = '2027-06-10T09:00:00.000Z' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="hero-countdown-wrapper">
      <div className="countdown-grid">
        <div className="countdown-unit-box">
          <span className="countdown-val">{timeLeft.days}</span>
          <span className="countdown-lbl">Days</span>
        </div>
        <div className="countdown-unit-box">
          <span className="countdown-val">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-lbl">Hours</span>
        </div>
        <div className="countdown-unit-box">
          <span className="countdown-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-lbl">Minutes</span>
        </div>
        <div className="countdown-unit-box">
          <span className="countdown-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-lbl">Seconds</span>
        </div>
      </div>
    </div>
  );
};
