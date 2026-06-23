// ===== IMPORTS =====

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../redux/slices/authSlice.js'
import { adminAccount } from '../pages-auth/Login.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const admin storage key ------
const ADMIN_STORAGE_KEY = 'kienshoes_admin_account'

// ------ Khai báo const username ------
const username = adminAccount.username

// ------ Khai báo const password ------
const password = adminAccount.password

// ------ Đối tượng cấu hình/dữ liệu default admin ------
const defaultAdmin = {
  username,
  password,
  fullName: 'Lê Đức Kiên',
  email: 'admin@kienshoes.vn',
  role: 'admin',
}

// ------ Hàm lấy admin account ------
const getAdminAccount = () => {

  // ------ Khai báo const data ------
  const data = localStorage.getItem(ADMIN_STORAGE_KEY)

  if (data) {

    // ------ Khai báo const admin ------
    const admin = JSON.parse(data)

    return {
      username: admin.username || defaultAdmin.username,
      password: admin.password || defaultAdmin.password,
      fullName: admin.fullName || defaultAdmin.fullName,
      email: admin.email || defaultAdmin.email,
      role: 'admin',
    }
  }

  return defaultAdmin
}

// ------ Hàm/Component saveAdminAccount ------
const saveAdminAccount = (admin) => {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin))
}

// ------ Hàm/Component AdminProfile ------
const AdminProfile = () => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lay dữ liệu user từ Redux store ------
  const user = useSelector((state) => state.authStore.user)

  // ------ Khai báo const admin account ------
  const adminAccount = getAdminAccount()

  // ------ State lưu form ------
  const [form, setForm] = useState({
    username: adminAccount.username || user?.username || defaultAdmin.username,
    fullName: adminAccount.fullName || user?.fullName || defaultAdmin.fullName,
    email: adminAccount.email || user?.email || defaultAdmin.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // ------ State lưu errors ------
  const [errors, setErrors] = useState({})

  // ------ Hàm kiểm tra form ------
  const validateForm = () => {

    // ------ Đối tượng cấu hình/dữ liệu new errors ------
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên admin'
    }

    if (!form.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email admin'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Email không đúng định dạng'
    }

    if (!form.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    } else if (form.currentPassword !== adminAccount.password) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không đúng'
    }

    if (form.newPassword || form.confirmPassword) {
      if (!form.newPassword) {
        newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
      } else if (form.newPassword === adminAccount.password) {
        newErrors.newPassword =
          'Mật khẩu mới không được trùng với mật khẩu hiện tại'
      } else if (form.newPassword.length < 6) {
        newErrors.newPassword = 'Mật khẩu tối thiểu 6 ký tự'
      } else if (!/[a-z]/.test(form.newPassword)) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ thường'
      } else if (!/[A-Z]/.test(form.newPassword)) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ hoa'
      } else if (!/[0-9]/.test(form.newPassword)) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ số'
      } else if (!/[^a-zA-Z0-9]/.test(form.newPassword)) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
      }

      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      } else if (form.confirmPassword !== form.newPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ------ Hàm xử lý change ------
  const handleChange = (e) => {

    // ------ Khai báo const nhóm giá trị ------
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value,
    })

    setErrors({
      ...errors,
      [name]: '',
    })
  }

  // ------ Hàm xử lý submit ------
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // ------ Khai báo const confirm update ------
    const confirmUpdate = confirm(
      'Bạn có chắc muốn lưu thay đổi thông tin admin không?'
    )

    if (!confirmUpdate) return

    // ------ Đối tượng cấu hình/dữ liệu new admin ------
    const newAdmin = {
      ...adminAccount,
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.newPassword ? form.newPassword : adminAccount.password,
      role: 'admin',
    }

    saveAdminAccount(newAdmin)

    dispatch(
      loginSuccess({
        username: newAdmin.username,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: 'admin',
      })
    )

    setForm({
      username: newAdmin.username,
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

    setErrors({})

    alert('Cập nhật thông tin admin thành công!')
  }

  // ------ Hàm xử lý reset form ------
  const handleResetForm = () => {
    setForm({
      username: adminAccount.username,
      fullName: adminAccount.fullName || defaultAdmin.fullName,
      email: adminAccount.email || defaultAdmin.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

    setErrors({})
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="w-full min-w-0 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">
          Thông tin admin
        </h1>

        <p className="mt-2 font-bold text-slate-400">
          Thông tin tài khoản quản trị và bảo mật hệ thống KienShoes.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-5xl text-indigo-600">
              <i className="fa-solid fa-user-gear"></i>
            </div>

            <h2 className="mt-5 text-2xl font-black">
              {adminAccount.fullName || defaultAdmin.fullName}
            </h2>

            <p className="mt-1 font-bold text-indigo-600">
              {adminAccount.role || defaultAdmin.role}
            </p>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-600">
              Đang hoạt động
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-black text-slate-900">
              Thông tin admin
            </h2>

            <div className="space-y-3 text-sm font-bold text-slate-600">
              <div className="flex justify-between gap-4">
                <span>Họ tên:</span>
                <span className="text-right text-slate-900">
                  {adminAccount.fullName || defaultAdmin.fullName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Tên đăng nhập:</span>
                <span className="text-right text-slate-900">
                  {adminAccount.username || defaultAdmin.username}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Email:</span>
                <span className="text-right text-slate-900">
                  {adminAccount.email || defaultAdmin.email}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Vai trò:</span>
                <span className="text-right text-indigo-600">
                  {adminAccount.role || defaultAdmin.role}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Tính năng:</span>
                <span className="text-right text-slate-900">
                  Quản lý hệ thống
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 text-xl font-black">
            Cập nhật thông tin bảo mật
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500">
                  Họ tên admin
                </label>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 font-bold outline-none focus:border-indigo-500"
                  placeholder="Nhập họ tên admin"
                />

                {errors.fullName && (
                  <p className="mt-1 text-sm font-bold text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500">
                  Tên đăng nhập admin
                </label>

                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 font-bold outline-none focus:border-indigo-500"
                  placeholder="Nhập tên đăng nhập admin"
                />

                {errors.username && (
                  <p className="mt-1 text-sm font-bold text-red-500">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-500">
                Email admin
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 font-bold outline-none focus:border-indigo-500"
                placeholder="Nhập email admin"
              />

              {errors.email && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-500">
                Mật khẩu hiện tại
              </label>

              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                placeholder="Nhập mật khẩu hiện tại để xác nhận thay đổi"
              />

              {errors.currentPassword && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500">
                  Mật khẩu mới
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Có thể bỏ trống nếu không đổi mật khẩu"
                />

                {errors.newPassword && (
                  <p className="mt-1 text-sm font-bold text-red-500">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-500">
                  Xác nhận mật khẩu mới
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Nhập lại mật khẩu mới"
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm font-bold text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <h3 className="font-black text-yellow-700">
                Lưu ý bảo mật
              </h3>

              <p className="mt-2 text-sm font-bold text-slate-600">
                Có thể cập nhật họ tên, email, tên đăng nhập hoặc mật khẩu.
                Nếu không muốn đổi mật khẩu, hãy bỏ trống 2 ô mật khẩu mới và
                xác nhận mật khẩu mới.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Lưu thay đổi
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="cursor-pointer rounded-xl bg-slate-200 px-6 py-3 font-bold text-slate-700 hover:bg-slate-300"
              >
                Hủy thao tác
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

// ===== EXPORTS =====

export default AdminProfile