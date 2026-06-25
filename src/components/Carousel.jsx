// ===== IMPORTS =====

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const banners ------
const banners = [
  {
    id: 1,
    to: '/promotions',
    image: './images/banner1.png',
    alt: 'Săn sale cực chất',
  },
  {
    id: 2,
    to: '/policy',
    image: './images/banner2.png',
    alt: 'Chính sách KienShoes',
  },
]

// ------ Hàm/Component Carousel ------
const Carousel = () => {

  // ------ State lưu current index ------
  const [currentIndex, setCurrentIndex] = useState(0)

  // ------ State lưu start x ------
  const [startX, setStartX] = useState(0)

  // ------ State lưu is dragging ------
  const [isDragging, setIsDragging] = useState(false)

  // ------ Ref tham chiếu timer ref ------
  const timerRef = useRef(null)

  // ------ Hàm/Component goToSlide ------
  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentIndex(banners.length - 1)
      return
    }

    if (index >= banners.length) {
      setCurrentIndex(0)
      return
    }

    setCurrentIndex(index)
  }

  // ------ Hàm/Component resetAutoPlay ------
  const resetAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        return prev >= banners.length - 1 ? 0 : prev + 1
      })
    }, 5000)
  }

  useEffect(() => {
    resetAutoPlay()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    resetAutoPlay()
  }, [currentIndex])

  // ------ Hàm xử lý touch start ------
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  // ------ Hàm xử lý touch end ------
  const handleTouchEnd = (e) => {
    if (!isDragging) return

    // ------ Khai báo const end x ------
    const endX = e.changedTouches[0].clientX

    // ------ Khai báo const distance ------
    const distance = startX - endX

    if (distance > 50) {
      goToSlide(currentIndex + 1)
    }

    if (distance < -50) {
      goToSlide(currentIndex - 1)
    }

    setIsDragging(false)
  }

  // ------ Hàm xử lý mouse down ------
  const handleMouseDown = (e) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  // ------ Hàm xử lý mouse up ------
  const handleMouseUp = (e) => {
    if (!isDragging) return

    // ------ Khai báo const end x ------
    const endX = e.clientX

    // ------ Khai báo const distance ------
    const distance = startX - endX

    if (distance > 50) {
      goToSlide(currentIndex + 1)
    }

    if (distance < -50) {
      goToSlide(currentIndex - 1)
    }

    setIsDragging(false)
  }

  // ------ Hàm xử lý mouse leave ------
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            to={banner.to}
            className="overflow-hidden rounded-3xl"
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full duration-300 hover:scale-103"
              draggable="false"
            />
          </Link>
        ))}
      </div>

      {/* Mobile */}
      <div className="relative overflow-hidden rounded-3xl md:hidden">
        <div
          className="flex cursor-grab transition-transform duration-600 active:cursor-grabbing"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {banners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.to}
              className="w-full shrink-0 overflow-hidden rounded-3xl"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full select-none object-cover"
                draggable="false"
              />
            </Link>
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-6 bg-orange-500'
                  : 'w-2.5 bg-white/70'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </>
  )
}

// ===== EXPORTS =====

export default Carousel
