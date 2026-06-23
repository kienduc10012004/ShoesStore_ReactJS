// ===== IMPORTS =====

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component AdminLayout ------
const AdminLayout = () => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate();

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch();

  // ------ State lưu open mobile menu ------
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // ------ Khai báo const menu items ------
  const menuItems = [
    {
      name: "Dashboard",
      shortName: "Dashboard",
      path: "/admin",
      icon: "fa-solid fa-chart-line",
    },
    {
      name: "Quản lý sản phẩm",
      shortName: "Sản phẩm",
      path: "/admin/products",
      icon: "fa-solid fa-shoe-prints",
    },
    {
      name: "Quản lý đơn hàng",
      shortName: "Đơn hàng",
      path: "/admin/orders",
      icon: "fa-solid fa-receipt",
    },
    {
      name: "Quản lý khách hàng",
      shortName: "User",
      path: "/admin/customers",
      icon: "fa-solid fa-users",
    },
    {
      name: "Thông tin admin",
      shortName: "Admin",
      path: "/admin/profile",
      icon: "fa-solid fa-user-gear",
    },
    {
      name: "Quản lý đánh giá",
      shortName: "Đánh giá",
      path: "/admin/reviews",
      icon: "fa-solid fa-star",
    },
    {
      name: "Quản lý quà tặng",
      shortName: "Quà tặng",
      path: "/admin/gifts",
      icon: "fa-solid fa-gift",
    },
  ];

  // ------ Hàm xử lý logout ------
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ------ Chuỗi class hiển thị desktop link class ------
  const desktopLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold duration-200 ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="min-h-screen bg-slate-50">
      {/* MOBILE BUTTON */}

      <button
        onClick={() => setOpenMobileMenu(true)}
        className="fixed bottom-5 right-5 z-[70] h-14 w-14 cursor-pointer rounded-full bg-indigo-600 text-white shadow-2xl md:hidden"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* MOBILE OVERLAY */}

      {openMobileMenu && (
        <div
          onClick={() => setOpenMobileMenu(false)}
          className="fixed inset-0 z-[80] bg-black/50 md:hidden"
        />
      )}

      {/* MOBILE DRAWER */}

      <div
        className={`fixed left-0 top-0 z-[90] flex h-[70%] w-[78%] max-w-xs flex-col rounded-br-3xl bg-slate-950 p-5 text-white shadow-2xl duration-300 md:hidden ${
          openMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-full mb-10">
          <button
            onClick={() => setOpenMobileMenu(false)}
            className="mt-4 mb-3 absolute h-12 w-10 shrink-0 right-0 cursor-pointer rounded-xl bg-white/10 font-black hover:bg-red-500"
          >
            X
          </button>
        </div>

        <NavLink to="/admin" className="mb-8 flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/images/logoWeb.png" alt="logo KienShoes" className="w-8" />
                <h1 className="text-xl font-black text-orange-500">KienShoes</h1>
              </div>

              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </NavLink>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm font-bold">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setOpenMobileMenu(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 ${
                  isActive ? "bg-indigo-600" : "hover:bg-white/10"
                }`
              }
            >
              <i className={`${item.icon} mr-3`} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LAYOUT */}

      <div className="lg:flex">
        {/* DESKTOP SIDEBAR */}

        <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-slate-950 p-5 text-white lg:block">
          <NavLink to="/admin" className="mb-8 flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/images/logoWeb.png" alt="logo KienShoes" className="w-8" />
                <h1 className="text-xl font-black text-orange-500">KienShoes</h1>
              </div>

              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </NavLink>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={desktopLinkClass}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* TABLET MENU */}

        <div className="fixed bottom-0 left-0 right-0 z-50 hidden border-t border-slate-800 bg-slate-950 text-white md:block lg:hidden">
          <div className="grid grid-cols-7 text-[11px] font-bold">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 ${
                    isActive ? "text-indigo-400" : "text-slate-300"
                  }`
                }
              >
                <i className={item.icon}></i>
                <span>{item.shortName}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* CONTENT */}

        <div className="w-full lg:ml-64">
          {/* HEADER */}

          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <h2 className="text-lg font-black text-slate-900 sm:text-2xl">
                  KienShoes Admin
                </h2>

                <p className="text-xs font-bold text-slate-400 sm:text-sm">
                  Quản trị hệ thống bán giày
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-xl bg-red-600 px-3 py-3 text-sm font-bold text-white hover:bg-red-700 sm:px-4 duration-100"
              >
                Đăng xuất
              </button>
            </div>
          </header>

          {/* PAGE CONTENT */}

          <main className="w-full overflow-x-hidden mb-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

// ===== EXPORTS =====

export default AdminLayout;
