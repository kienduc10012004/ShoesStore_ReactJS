// ===== IMPORTS =====

import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu user layout ------
const UserLayout = ({
  cartCount,
  totalQuantity,
  user,
  onOpenCart,
  onOpenLogin,
  onShowLoginMessage,
}) => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        cartCount={cartCount}
        totalQuantity={totalQuantity}
        user={user}
        onOpenCart={onOpenCart}
        onOpenLogin={onOpenLogin}
        onShowLoginMessage={onShowLoginMessage}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

// ===== EXPORTS =====

export default UserLayout