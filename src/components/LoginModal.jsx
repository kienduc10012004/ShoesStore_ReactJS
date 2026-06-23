// ===== IMPORTS =====

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/slices/authSlice.js'
import { useNavigate } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component LoginModal ------
const LoginModal = ({ isOpen, onClose }) => {

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch()

  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate()

  if (!isOpen) return null

  // ------ Đối tượng cấu hình/dữ liệu login schema ------
  const loginSchema = Yup.object({
    username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  })

  // ------ Hàm xử lý submit ------
  const handleSubmit = (values) => {
    let loginUser

    if (
      values.username === 'admin' &&
      values.password === 'Admin123@'
    ) {
      loginUser = {
        username: 'admin',
        fullName: 'Administrator',
        role: 'admin',
      }

      dispatch(loginSuccess(loginUser))

      onClose()

      navigate('/admin')

      return
    }

    loginUser = {
      username: values.username,
      fullName: values.username,
      role: 'user',
    }

    dispatch(loginSuccess(loginUser))

    onClose()

    navigate('/')
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-950">
              Đăng nhập
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Đăng nhập để sử dụng giỏ hàng và kiểm tra đơn hàng.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 font-bold hover:bg-slate-200"
          >
            X
          </button>
        </div>

        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-slate-700">
                  Tên đăng nhập
                </label>

                <Field
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className={`w-full rounded-xl border px-4 py-3 outline-none ${
                    touched.username && errors.username
                      ? 'border-red-500'
                      : 'border-slate-300 focus:border-blue-500'
                  }`}
                />

                <ErrorMessage
                  name="username"
                  component="p"
                  className="mt-2 text-sm font-semibold text-red-500"
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block font-bold text-slate-700">
                  Mật khẩu
                </label>

                <Field
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className={`w-full rounded-xl border px-4 py-3 outline-none ${
                    touched.password && errors.password
                      ? 'border-red-500'
                      : 'border-slate-300 focus:border-blue-500'
                  }`}
                />

                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-2 text-sm font-semibold text-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
              >
                Đăng nhập
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

// ===== EXPORTS =====

export default LoginModal