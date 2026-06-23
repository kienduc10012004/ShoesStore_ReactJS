import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const POPUP_KEY = 'kienshoes_promotion_popup_closed_at'
const HIDE_TIME = 5 * 60 * 1000
const ANIMATION_TIME = 300

const AdvPopup = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const closedAt = Number(localStorage.getItem(POPUP_KEY) || 0)
    const now = Date.now()

    if (!closedAt || now - closedAt >= HIDE_TIME) {
      setIsOpen(true)

      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }
  }, [])

  const closeWithAnimation = (callback) => {
    localStorage.setItem(POPUP_KEY, String(Date.now()))
    setIsVisible(false)

    setTimeout(() => {
      setIsOpen(false)

      if (callback) {
        callback()
      }
    }, ANIMATION_TIME)
  }

  const closePopup = (e) => {
    e.stopPropagation()
    closeWithAnimation()
  }

  const goToPromotions = () => {
    closeWithAnimation(() => {
      navigate('/promotions')
    })
  }

  if (!isOpen) return null

  return (
    <div
      onClick={goToPromotions}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[2px] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-[92%] max-w-4xl transform-gpu transition-all duration-300 ease-[cubic-bezier(.18,.89,.32,1.28)] will-change-transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-70 opacity-0'
        }`}
      >
        <button
          onClick={closePopup}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-xl font-black text-red-600 shadow-xl transition duration-150 hover:bg-red-600 hover:text-white"
        >
          X
        </button>

        <img
          onClick={goToPromotions}
          src="/images/banner1.png"
          alt="Săn sale cực chất cùng KienShoes"
          className="w-full cursor-pointer select-none rounded-3xl object-contain shadow-2xl"
          draggable="false"
        />
      </div>
    </div>
  )
}

export default AdvPopup