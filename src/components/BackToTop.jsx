// ===== IMPORTS =====

import { useEffect, useState } from "react";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component BackToTop ------
const BackToTop = () => {

  // ------ State lưu is show ------
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {

    // ------ Hàm xử lý scroll ------
    const handleScroll = () => {
      setIsShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ------ Hàm xử lý back to top ------
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isShow) return null;

  // ===== RENDER GIAO DIỆN =====

  return (
    <button
      onClick={handleBackToTop}
      className="fixed bottom-16 right-3 z-[999] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#ff6900]/30 text-white shadow-lg transition hover:-translate-y-1 hover:bg-orange-600"
      title="Lên đầu trang"
    >
      <i class="fa-solid fa-caret-up"></i>
    </button>
  );
};

// ===== EXPORTS =====

export default BackToTop;
