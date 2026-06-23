// ===== IMPORTS =====

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { findUserByEmail, findUserByPhone } from '../../utils/userStorage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component ForgotPassword ------
const ForgotPassword = () => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ State lưu method ------
  const [method, setMethod] = useState('')

  // ------ State lưu value ------
  const [value, setValue] = useState('')

  // ------ State lưu error ------
  const [error, setError] = useState('')

  // ------ Hàm xử lý confirm ------
  const handleConfirm = () => {
    setError('')

    if (!method) {
      setError('Vui lòng chọn phương thức lấy lại mật khẩu')
      return
    }

    if (!value.trim()) {
      setError('Vui lòng nhập thông tin cần xác nhận')
      return
    }

    // ------ Khai báo const user ------
    const user =
      method === 'email'
        ? findUserByEmail(value.trim())
        : findUserByPhone(value.trim())

    if (!user) {
      setError('Không tìm thấy tài khoản')
      return
    }

    navigate('/reset-password', {
      state: {
        username: user.username,
        method,
        value,
      },
    })
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-black text-black">
          Quên mật khẩu
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setMethod('phone')
              setValue('')
              setError('')
            }}
            className={`cursor-pointer rounded-xl border py-3 font-bold ${
              method === 'phone' ? 'bg-orange-600 text-white' : ''
            }`}
          >
            Số điện thoại
          </button>

          <button
            onClick={() => {
              setMethod('email')
              setValue('')
              setError('')
            }}
            className={`cursor-pointer rounded-xl border py-3 font-bold ${
              method === 'email' ? 'bg-orange-600 text-white' : ''
            }`}
          >
            Email
          </button>
        </div>

        {method && (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-5 w-full rounded-xl border px-4 py-3"
            placeholder={
              method === 'email' ? 'Nhập email' : 'Nhập số điện thoại'
            }
          />
        )}

        {error && <p className="mt-2 font-bold text-red-500">{error}</p>}

        <button
          onClick={handleConfirm}
          className="mt-6 w-full cursor-pointer rounded-xl bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 duration-100"
        >
          Xác nhận
        </button>

        <div className="mt-5 flex justify-between font-bold">
          <Link to="/login" className="text-red-600">
            Quay lại đăng nhập
          </Link>

          <Link to="/" className="text-slate-500">
            Trang chủ
          </Link>
        </div>
      </div>
    </main>
  )
}

// ===== EXPORTS =====

export default ForgotPassword