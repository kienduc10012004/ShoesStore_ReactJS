// ===== IMPORTS =====

import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllCustomers } from '../../utils/adminUtils.js'
import { adminAccount } from '../pages-auth/Login.jsx'
import { showConfirm } from '../../utils/confirmDialog.js'
import { readJsonStorage } from '../../utils/storage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const admin storage key ------
const ADMIN_STORAGE_KEY = 'HiKushoes_admin_account'

// ------ Khai báo const username ------
const username = adminAccount.username

// ------ Khai báo const password ------
const password = adminAccount.password

// ------ Hàm lấy admin account ------
const getAdminAccount = () => {

  // ------ Khai báo const admin ------
  const admin = readJsonStorage(ADMIN_STORAGE_KEY, null)

  if (admin) {
    return {
      username: admin.username || 'admin',
      password: admin.password || 'Admin123@',
    }
  }

  return {
    username, password
  }
}

// ------ Hàm/Component truncateText ------
const truncateText = (text = '', maxLength) => {
  if (!text) return ''

  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text
}

// ------ Hàm/Component ManageCustomers ------
const ManageCustomers = () => {

  // ------ Lay dữ liệu current user từ Redux store ------
  const currentUser = useSelector((state) => state.authStore.user)

  // ------ Hàm lấy only customers ------
  const getOnlyCustomers = () => {
    return getAllCustomers().filter((user) => user.role !== 'admin')
  }

  // ------ State lưu customers ------
  const [customers, setCustomers] = useState(getOnlyCustomers())

  // ------ State lưu search text ------
  const [searchText, setSearchText] = useState('')

  // ------ State lưu keyword ------
  const [keyword, setKeyword] = useState('')

  // ------ State lưu visible password ids ------
  const [visiblePasswordIds, setVisiblePasswordIds] = useState([])

  // ------ State lưu selected customer ------
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // ------ State lưu admin form ------
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
  })

  // ------ State lưu popup error ------
  const [popupError, setPopupError] = useState('')

  // ------ Hàm/Component filteredCustomers ------
  const filteredCustomers = useMemo(() => {

    // ------ Khai báo const value ------
    const value = keyword.toLowerCase().trim()

    if (!value) return customers

    return customers.filter((customer) => {
      return (
        customer.username?.toLowerCase().includes(value) ||
        customer.email?.toLowerCase().includes(value) ||
        customer.phone?.toLowerCase().includes(value) ||
        customer.role?.toLowerCase().includes(value)
      )
    })
  }, [customers, keyword])

  // ------ Đối tượng cấu hình/dữ liệu stats ------
  const stats = {
    total: customers.length,
    active: customers.filter((item) => item.status !== 'locked').length,
    locked: customers.filter((item) => item.status === 'locked').length,
  }

  // ------ Hàm/Component saveCustomers ------
  const saveCustomers = (newCustomers) => {
    setCustomers(newCustomers)
    localStorage.setItem('HiKushoes_users', JSON.stringify(newCustomers))
  }

  // ------ Hàm xử lý search ------
  const handleSearch = () => {
    setKeyword(searchText)
  }

  // ------ Hàm xử lý clear search ------
  const handleClearSearch = () => {
    setSearchText('')
    setKeyword('')
  }

  // ------ Hàm mở password popup ------
  const openPasswordPopup = (customer) => {
    setSelectedCustomer(customer)
    setAdminForm({
      username: '',
      password: '',
    })
    setPopupError('')
  }

  // ------ Hàm đóng password popup ------
  const closePasswordPopup = () => {
    setSelectedCustomer(null)
    setPopupError('')
  }

  // ------ Hàm xử lý confirm show password ------
  const handleConfirmShowPassword = () => {

    // ------ Khai báo const admin account ------
    const adminAccount = getAdminAccount()

    if (
      adminForm.username !== adminAccount.username ||
      adminForm.password !== adminAccount.password
    ) {
      setPopupError('Tài khoản admin không đúng!')
      return
    }

    setVisiblePasswordIds((prev) => [
      ...prev,
      String(selectedCustomer.username),
    ])

    closePasswordPopup()
  }

  // ------ Hàm xử lý toggle password ------
  const handleTogglePassword = (customer) => {

    // ------ Khai báo const id ------
    const id = String(customer.username)

    if (visiblePasswordIds.includes(id)) {
      setVisiblePasswordIds((prev) => prev.filter((item) => item !== id))
      return
    }

    openPasswordPopup(customer)
  }

  // ------ Hàm xử lý toggle status ------
  const handleToggleStatus = (username) => {
    if (username === currentUser?.username) {
      alert('Không thể khóa tài khoản đang đăng nhập')
      return
    }

    // ------ Hàm/Component newCustomers ------
    const newCustomers = customers.map((customer) => {
      if (customer.username === username) {
        return {
          ...customer,
          status: customer.status === 'locked' ? 'active' : 'locked',
        }
      }

      return customer
    })

    saveCustomers(newCustomers)
  }

  // ------ Hàm xử lý delete customer ------
  const handleDeleteCustomer = async (username) => {

    // ------ Khai báo const customer ------
    const customer = customers.find((item) => item.username === username)

    if (customer?.role === 'admin') {
      alert('Không thể xóa tài khoản admin')
      return
    }

    if (username === currentUser?.username) {
      alert('Không thể xóa tài khoản đang đăng nhập')
      return
    }

    const confirmDelete = await showConfirm({
      title: 'Xóa tài khoản?',
      message: `Bạn có chắc muốn xóa tài khoản "${username}" không?`,
      confirmText: 'Xóa',
    })

    if (confirmDelete) {

      // ------ Khai báo const new customers ------
      const newCustomers = customers.filter(
        (customer) => customer.username !== username
      )

      saveCustomers(newCustomers)

      setVisiblePasswordIds((prev) =>
        prev.filter((item) => item !== String(username))
      )
    }
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="grid w-full min-w-0 max-w-full gap-8 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
      {selectedCustomer && (
        <div
          onClick={closePasswordPopup}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Xác thực admin
              </h2>

              <button
                onClick={closePasswordPopup}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-slate-100 font-bold hover:bg-red-500 hover:text-white"
              >
                X
              </button>
            </div>

            <p className="mb-4 text-sm font-bold text-slate-500">
              Vui lòng nhập tài khoản admin để xem mật khẩu khách hàng.
            </p>

            <div className="space-y-4">
              <input
                value={adminForm.username}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    username: e.target.value,
                  })
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Tên đăng nhập admin"
              />

              <input
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({
                    ...adminForm,
                    password: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmShowPassword()
                  }
                }}
                type="password"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Mật khẩu admin"
              />

              {popupError && (
                <p className="text-sm font-bold text-red-500">
                  {popupError}
                </p>
              )}

              <button
                onClick={handleConfirmShowPassword}
                className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Quản lý khách hàng
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Quản lý tài khoản, mật khẩu, trạng thái và quyền hạn khách hàng.
        </p>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-400">Tổng khách hàng</p>
          <h2 className="mt-2 text-3xl font-black">{stats.total}</h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-500">Hoạt động</p>
          <h2 className="mt-2 text-3xl font-black text-emerald-600">
            {stats.active}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-red-500">Đã khóa</p>
          <h2 className="mt-2 text-3xl font-black text-red-600">
            {stats.locked}
          </h2>
        </div>
      </section>

      <section className="min-w-0  overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Danh sách khách hàng</h2>
            <p className="mt-1 text-sm font-bold text-slate-400">
              Hiển thị {filteredCustomers.length} / {customers.length} khách hàng
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500 md:w-72"
              placeholder="Tên đăng nhập, email, SĐT..."
            />

            <button
              onClick={handleSearch}
              className="cursor-pointer rounded-xl bg-black px-5 py-3 font-bold text-white hover:bg-black/80 duration-100"
            >
              Tìm
            </button>

            {keyword && (
              <button
                onClick={handleClearSearch}
                className="cursor-pointer rounded-xl bg-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-300"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div
          className="w-full overflow-x-auto"
          style={{
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <table className="w-full min-w-[1100px] table-fixed text-left xl:min-w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b text-xs uppercase text-slate-400">
                <th className="w-[150px] whitespace-nowrap p-4">
                  Tên đăng nhập
                </th>

                <th className="w-[210px] whitespace-nowrap p-4 text-center">
                  Email
                </th>

                <th className="w-[130px] whitespace-nowrap p-4 text-center">
                  SĐT
                </th>

                <th className="w-[145px] whitespace-nowrap p-4 text-center">
                  Ngày tạo
                </th>

                <th className="w-[90px] whitespace-nowrap p-4 text-center">
                  Vai trò
                </th>

                <th className="w-[145px] whitespace-nowrap p-4 text-center">
                  Mật khẩu
                </th>

                <th className="w-[125px] whitespace-nowrap p-4 text-center">
                  Trạng thái
                </th>

                <th className="w-[170px] whitespace-nowrap p-4 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer, index) => {

                // ------ Khai báo const user id ------
                const userId = String(customer.username)

                // ------ Khai báo const password is visible ------
                const passwordIsVisible = visiblePasswordIds.includes(userId)

                // ------ Khai báo const is locked ------
                const isLocked = customer.status === 'locked'

                // ------ Khai báo const status text ------
                const statusText = isLocked ? 'Đã khóa' : 'Hoạt động'

                // ------ Khai báo const status button text ------
                const statusButtonText = isLocked ? 'Mở' : 'Khóa'

                // ------ Khai báo const is current user ------
                const isCurrentUser = customer.username === currentUser?.username

                return (
                  <tr
                    key={`${customer.username}-${index}`}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="group relative inline-block">
                        <span className="font-bold">
                          {truncateText(customer.username, 8)}
                        </span>

                        {customer.username?.length > 10 && (
                          <div className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
                            {customer.username}
                          </div>
                        )}

                        {isCurrentUser && (
                          <p className="text-xs font-bold text-indigo-600">
                            Đang đăng nhập
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="group relative inline-block max-w-full">
                        <span>{truncateText(customer.email || 'Chưa có', 20)}</span>

                        {customer.email?.length > 20 && (
                          <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {customer.phone || 'Chưa có'}
                    </td>

                    <td className="p-4 text-center">
                      {customer.createdAt || 'Chưa có'}
                    </td>

                    <td className="p-4 text-center">
                      {customer.role || 'user'}
                    </td>

                    <td className="p-4 text-center">
                      <div className="group relative inline-block">
                        <span>
                          {passwordIsVisible
                            ? truncateText(customer.password || '', 10)
                            : '********'}
                        </span>

                        {passwordIsVisible &&
                          customer.password?.length > 10 && (
                            <div className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100">
                              {customer.password}
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() => handleTogglePassword(customer)}
                        className="ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        <i
                          className={
                            passwordIsVisible
                              ? 'fa-regular fa-eye-slash'
                              : 'fa-regular fa-eye'
                          }
                        ></i>
                      </button>
                    </td>

                    <td className="whitespace-nowrap p-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isLocked
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {statusText}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-nowrap justify-center gap-2 whitespace-nowrap">
                        <button
                          disabled={isCurrentUser}
                          onClick={() => handleToggleStatus(customer.username)}
                          className={`cursor-pointer rounded-xl py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 ${
                            isLocked
                              ? 'bg-emerald-500 px-5 hover:bg-emerald-600'
                              : 'bg-amber-500 px-4 hover:bg-amber-600'
                          }`}
                        >
                          {statusButtonText}
                        </button>

                        {customer.role !== 'admin' && (
                          <button
                            disabled={isCurrentUser}
                            onClick={() =>
                              handleDeleteCustomer(customer.username)
                            }
                            className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-8 text-center font-bold text-slate-400"
                  >
                    Không tìm thấy người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default ManageCustomers
