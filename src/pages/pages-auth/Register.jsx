// ===== IMPORTS =====

import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  addUser,
  findUserByEmail,
  findUserByPhone,
  findUserByUsername,
} from '../../utils/userStorage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component Register ------
const Register = () => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ Đối tượng cấu hình/dữ liệu formik ------
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập không được để trống'),

      email: Yup.string()
        .email('Email không đúng định dạng')
        .required('Email không được để trống'),

      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Số điện thoại phải đủ 10 số')
        .required('Số điện thoại không được để trống'),

      password: Yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .matches(/[a-z]/, 'Mật khẩu phải có chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải có chữ hoa')
        .matches(/[0-9]/, 'Mật khẩu phải có số')
        .matches(/[^a-zA-Z0-9]/, 'Mật khẩu phải có kí tự đặc biệt')
        .required('Mật khẩu không được để trống'),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Xác nhận mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    }),

    onSubmit: (values, { setFieldError }) => {

      // ------ Khai báo let has error ------
      let hasError = false

      if (findUserByUsername(values.username)) {
        setFieldError('username', 'Tên đăng nhập đã tồn tại')
        hasError = true
      }

      if (findUserByEmail(values.email)) {
        setFieldError('email', 'Email đã được đăng kí')
        hasError = true
      }

      if (findUserByPhone(values.phone)) {
        setFieldError('phone', 'Số điện thoại đã được đăng kí')
        hasError = true
      }

      if (hasError) return

      addUser({
        id: Date.now(),
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: 'user',
        status: 'active',
        createdAt: new Date().toLocaleString('vi-VN'),
      })

      alert('Đăng kí thành công! Vui lòng đăng nhập.')
      navigate('/login')
    },
  })

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-center text-3xl font-black text-blue-950">
          Đăng kí tài khoản
        </h1>

        {[
          ['username', 'Tên đăng nhập'],
          ['email', 'Email'],
          ['phone', 'Số điện thoại'],
          ['password', 'Mật khẩu'],
          ['confirmPassword', 'Xác nhận mật khẩu'],
        ].map(([name, label]) => (
          <div key={name} className="mt-4">
            <label className="mb-2 block font-bold">{label}</label>

            <input
              type={
                name === 'password' || name === 'confirmPassword'
                  ? 'password'
                  : 'text'
              }
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-xl border px-4 py-3"
              placeholder={`Nhập ${label.toLowerCase()}`}
            />

            {formik.touched[name] && formik.errors[name] && (
              <p className="mt-1 text-sm font-bold text-red-500">
                {formik.errors[name]}
              </p>
            )}
          </div>
        ))}

        <button className="mt-6 w-full cursor-pointer rounded-xl bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 duration-100">
          Đăng kí
        </button>

        <div className="mt-5 flex justify-between font-bold">
          <Link to="/login" className="text-red-600">
            Đã có tài khoản?
          </Link>

          <Link to="/" className="text-slate-500">
            Về trang chủ
          </Link>
        </div>
      </form>
    </main>
  )
}

// ===== EXPORTS =====

export default Register