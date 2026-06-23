// ===== IMPORTS =====

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { updateUserPassword } from '../../utils/userStorage.js'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component ResetPassword ------
const ResetPassword = () => {

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  // ------ Lấy thông tin vị trí route hiện tại ------
  const location = useLocation()

  // ------ Khai báo const username ------
  const username = location.state?.username

  // ------ Đối tượng cấu hình/dữ liệu formik ------
  const formik = useFormik({
    initialValues: {
      username: username || '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập không được để trống'),

      password: Yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .matches(/[a-z]/, 'Mật khẩu phải có chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải có chữ hoa')
        .matches(/[0-9]/, 'Mật khẩu phải có số')
        .matches(/[^a-zA-Z0-9]/, 'Mật khẩu phải có kí tự đặc biệt')
        .required('Mật khẩu mới không được để trống'),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Xác nhận mật khẩu không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
    }),

    onSubmit: (values) => {
      updateUserPassword(values.username, values.password)

      alert('Cập nhật mật khẩu thành công!')
      navigate('/login')
    },
  })

  if (!username) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black">Không có thông tin xác thực</h1>

          <Link
            to="/forgot-password"
            className="mt-5 inline-block rounded-xl bg-orange-600 px-5 py-3 font-bold text-white"
          >
            Quay lại
          </Link>
        </div>
      </main>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-center text-3xl font-black text-black">
          Lấy lại mật khẩu
        </h1>

        {[
          ['username', 'Tên đăng nhập'],
          ['password', 'Mật khẩu mới'],
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
              readOnly={name === 'username'}
              className="w-full rounded-xl border px-4 py-3 read-only:bg-slate-100"
            />

            {formik.touched[name] && formik.errors[name] && (
              <p className="mt-1 text-sm font-bold text-red-500">
                {formik.errors[name]}
              </p>
            )}
          </div>
        ))}

        <button className="mt-6 w-full cursor-pointer rounded-xl bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 duration-100">
          Lưu thay đổi
        </button>

        <Link
          to="/"
          className="mt-5 block text-center font-bold text-slate-500"
        >
          Quay lại trang chủ
        </Link>
      </form>
    </main>
  )
}

// ===== EXPORTS =====

export default ResetPassword