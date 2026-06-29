// ===== IMPORTS =====

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginSuccess } from "../../redux/slices/authSlice.js";
import { findUserByUsername } from "../../utils/userStorage.js";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ===== EXPORTS =====

// ------ Đối tượng cấu hình/dữ liệu admin account ------
export const adminAccount = {
  username: "admin",
  password: "Admin123@",
  fullName: "Lê Đức Kiên",
  role: "admin",
};

// ------ Hàm/Component Login ------
const Login = () => {
  // ------ Lấy hàm điều hướng trang ------
  const navigate = useNavigate();

  // ------ Lấy hàm dispatch để gửi action Redux ------
  const dispatch = useDispatch();

  // ------ Hàm lấy admin account ------
  const getAdminAccount = () => {
    // ------ Khai báo const data ------
    const data = localStorage.getItem("HiKushoes_admin_account");

    if (data) {
      return JSON.parse(data);
    }

    return adminAccount;
  };

  // ------ Đối tượng cấu hình/dữ liệu formik ------
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
    }),

    onSubmit: (values, { setFieldError }) => {
      // ------ Khai báo const admin account defaul ------
      const adminAccountDefaul = getAdminAccount();
      if (
        values.username === adminAccountDefaul.username &&
        values.password === adminAccountDefaul.password
      ) {
        dispatch(
          loginSuccess({
            username: adminAccountDefaul.username,
            fullName: adminAccountDefaul.fullName,
            email: adminAccountDefaul.email,
            role: "admin",
          }),
        );

        navigate("/admin");
        return;
      }

      // ------ Khai báo const user ------
      const user = findUserByUsername(values.username);

      if (!user) {
        setFieldError("username", "Sai tài khoản hoặc tài khoản chưa tồn tại");
        return;
      }

      if (user.password !== values.password) {
        setFieldError("password", "Mật khẩu không đúng");
        return;
      }

      if (user.status === "locked") {
        setFieldError("username", "Tài khoản đã bị khóa");
        return;
      }

      dispatch(loginSuccess(user));
      navigate("/");
    },
  });

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-center text-3xl font-black text-black">
          Đăng nhập
        </h1>

        <div className="mt-6">
          <label className="mb-2 block font-bold">Tên đăng nhập</label>
          <input
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Nhập tên đăng nhập"
          />
          {formik.touched.username && formik.errors.username && (
            <p className="mt-1 text-sm font-bold text-red-500">
              {formik.errors.username}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2 block font-bold">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Nhập mật khẩu"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-sm font-bold text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button className="mt-6 w-full cursor-pointer rounded-xl bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 duration-100">
          Đăng nhập
        </button>

        <div className="mt-5 flex justify-between font-bold">
          <Link to="/forgot-password" className="text-red-600">
            Quên mật khẩu?
          </Link>

          <Link to="/register" className="text-orange-500">
            Đăng kí
          </Link>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center font-bold text-slate-500"
        >
          Quay lại trang chủ
        </Link>
      </form>
    </main>
  );
};

export default Login;
