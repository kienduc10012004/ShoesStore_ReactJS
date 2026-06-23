// ===== IMPORTS =====

import { useEffect, useState } from "react";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component CountdownTimer ------
const CountdownTimer = ({ targetDate }) => {

  // ------ Hàm lấy time left ------
  const getTimeLeft = () => {

    // ------ Khai báo const distance ------
    const distance = new Date(targetDate) - new Date();

    if (distance <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };

  // ------ State lưu time left ------
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {

    // ------ Hàm/Component timer ------
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // ------ Khai báo const items ------
  const items = [
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ];

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="flex items-center gap-2 ">
      {/* Giờ */}
      <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
        <span className="font-black">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
      </div>

      <span className=" font-black">:</span>

      {/* Phút */}
      <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
        <span className=" font-black">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
      </div>

      <span className=" font-black">:</span>

      {/* Giây */}
      <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
        <span className=" font-black">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

// ===== EXPORTS =====

export default CountdownTimer;
