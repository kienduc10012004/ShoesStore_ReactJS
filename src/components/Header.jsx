// ===== IMPORTS =====

import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component Header ------
const Header = ({ totalQuantity, user, onOpenCart }) => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ State lưu is open user menu ------
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false)

  // ------ State lưu is open mobile menu ------
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  // ------ Ref tham chiếu user menu ref ------
  const userMenuRef = useRef(null)

  useEffect(() => {

    // ------ Hàm xử lý click outside ------
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsOpenUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isOpenMobileMenu) return

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpenMobileMenu])

  useEffect(() => {

    // ------ Hàm xử lý resize ------
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpenMobileMenu(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // ------ Hàm/Component shortUsername ------
  const shortUsername = (name = '') => {
    return name.length > 6 ? name.slice(0, 6) + '...' : name
  }

  // ------ Hàm đóng mobile menu ------
  const closeMobileMenu = () => {
    setIsOpenMobileMenu(false)
  }

  // ------ Hàm xử lý logout ------
  const handleLogout = () => {
    dispatch(logout())
    setIsOpenUserMenu(false)
    setIsOpenMobileMenu(false)
    navigate('/')
  }

  // ------ Hàm xử lý open cart ------
  const handleOpenCart = () => {
    closeMobileMenu()
    onOpenCart()
  }

  // ------ Hàm xử lý go login ------
  const handleGoLogin = () => {
    closeMobileMenu()
    navigate('/login')
  }

  // ------ Chuỗi class hiển thị nav link class ------
  const navLinkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 font-bold transition ${
      isActive
        ? 'bg-orange-100 text-orange-500'
        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-500'
    }`

  // ------ Chuỗi class hiển thị mobile nav link class ------
  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 font-bold transition ${
      isActive
        ? 'bg-orange-100 text-orange-500'
        : 'text-slate-700 hover:bg-slate-100 hover:text-orange-500'
    }`

  // ===== RENDER GIAO DIỆN =====

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logoWeb.png" alt="logo KienShoes" className="w-15" />
          <p className="text-2xl font-black text-orange-500">Kien<span className='text-2xl font-black text-black'>Shoes</span></p>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Trang chủ
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>

          <NavLink to="/promotions" className={navLinkClass}>
            Ưu đãi
          </NavLink>

          <NavLink to="/policy" className={navLinkClass}>
            Chính sách
          </NavLink>

          {user && (
            <NavLink to="/order-check" className={navLinkClass}>
              Kiểm tra đơn hàng
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}
                className="cursor-pointer rounded-xl border px-4 py-3 font-bold text-slate-700 hover:border-orange-500 hover:text-orange-500 duration-100"
                title={user.username}
              >
                {shortUsername(user.username)}
              </button>

              {isOpenUserMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-2xl border bg-white p-2 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="block w-full cursor-pointer rounded-xl px-4 py-2 text-left font-bold text-red-500 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>

                  <button
                    onClick={() => setIsOpenUserMenu(false)}
                    className="mt-1 block w-full cursor-pointer rounded-xl px-4 py-2 text-left font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Thoát
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer rounded-xl border px-4 py-3 font-bold hover:border-orange-500 hover:text-orange-500 duration-100"
            >
              Đăng nhập
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative cursor-pointer rounded-xl bg-black px-4 py-3 text-white duration-100 hover:bg-orange-600"
          >
            <i className="fa-solid fa-cart-arrow-down"></i>

            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs font-bold">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsOpenMobileMenu((prev) => !prev)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-black text-white lg:hidden"
        >
          <i
            className={`fa-solid ${
              isOpenMobileMenu ? 'fa-xmark' : 'fa-bars'
            }`}
          ></i>
        </button>
      </div>

      {isOpenMobileMenu && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          ></div>

          <aside
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex h-full w-[75%] min-w-[260px] max-w-sm flex-col overflow-hidden rounded-r-3xl bg-slate-50 shadow-2xl"
          >
            <div className="shrink-0 border-b p-5">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/images/logoWeb.png"
                    alt="logo KienShoes"
                    className="w-8"
                  />
                  <span className="text-xl font-black text-orange-500">
                    Kien<span className='-xl font-black text-black'>Shoes</span>
                  </span>
                </Link>

                <button
                  onClick={closeMobileMenu}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 font-bold hover:bg-red-500 hover:text-white"
                >
                  X
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <nav className="space-y-2">
                <NavLink
                  to="/"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Trang chủ
                </NavLink>

                <NavLink
                  to="/products"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Sản phẩm
                </NavLink>

                <NavLink
                  to="/promotions"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Ưu đãi
                </NavLink>

                <NavLink
                  to="/policy"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass}
                >
                  Chính sách
                </NavLink>

                {user && (
                  <NavLink
                    to="/order-check"
                    onClick={closeMobileMenu}
                    className={mobileNavLinkClass}
                  >
                    Kiểm tra đơn hàng
                  </NavLink>
                )}
              </nav>

              <div className="mt-5 space-y-3 border-t pt-5">
                {user ? (
                  <>
                    <div className="rounded-xl text-center bg-slate-100 px-4 py-3 font-bold text-slate-700">
                      Xin chào, {shortUsername(user.username)}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full cursor-pointer rounded-xl bg-red-500 px-4 py-3 font-bold text-center text-white hover:bg-red-600"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGoLogin}
                    className="w-full cursor-pointer rounded-xl border px-4 py-3 text-center font-bold hover:border-orange-500 hover:text-orange-500"
                  >
                    Đăng nhập
                  </button>
                )}

                <button
                  onClick={handleOpenCart}
                  className="relative w-full cursor-pointer rounded-xl bg-black px-4 py-3 font-bold text-white text-center hover:bg-blue-900"
                >
                  <i className="fa-solid fa-cart-arrow-down mr-2"></i>
                  Giỏ hàng

                  {totalQuantity > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-10 rounded-2xl bg-orange-50 p-4">
                <p className="text-sm font-bold text-orange-600">
                  Kien<span className='text-sm font-bold text-black'>Shoes</span>
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Cửa hàng giày sneaker dành cho người trẻ.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}

// ===== EXPORTS =====

export default Header