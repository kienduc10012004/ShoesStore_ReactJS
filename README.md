# HiKuShoes ReactJS

Website bán giày sneaker được xây dựng bằng React, Redux Toolkit, React Router, TanStack Query, Tailwind CSS và MockAPI.

## Ghi chú demo frontend

Dự án này là demo thuần frontend, phù hợp để học tập, làm đồ án và đưa vào CV. Một số phần như đăng nhập, phân quyền, giỏ hàng, đơn hàng và thông tin người dùng đang được mô phỏng bằng `localStorage`. Dữ liệu sản phẩm được thao tác qua MockAPI trực tiếp từ trình duyệt.

Vì chưa có backend thật, dự án không dùng cho production. Các phần như xác thực admin, lưu mật khẩu, phân quyền, thanh toán và kiểm tra tồn kho chỉ nên xem là mô phỏng UI/UX.

## Chức năng chính

- Trang người dùng: xem sản phẩm, lọc/tìm kiếm, chi tiết sản phẩm, giỏ hàng, checkout, kiểm tra đơn hàng, yêu cầu đổi trả.
- Trang admin: quản lý sản phẩm, đơn hàng, khách hàng, đánh giá, quà tặng, xuất Excel.
- UI thông báo toast thay cho `alert`.
- Modal xác nhận thay cho `confirm` mặc định của browser.

## Chạy dự án

```bash
npm install
npm run dev
```

Nếu dùng PowerShell trên Windows bị chặn `npm.ps1`, chạy:

```bash
npm.cmd run dev
```
