// ===== IMPORTS =====

import { Link } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const policies ------
const policies = [
  {
    id: 'warranty',
    title: 'Chính sách bảo hành',
    image: '/images/chinhsachbaohanh.png',
    desc: 'Bảo hành sản phẩm do lỗi kỹ thuật, keo đế hoặc lỗi sản xuất theo điều kiện của KienShoes.',
  },
  {
    id: 'return',
    title: 'Chính sách đổi trả',
    image: '/images/chinhsachdoitra.png',
    desc: 'Hỗ trợ đổi size, đổi màu hoặc đổi sản phẩm khi còn nguyên tem, hộp và chưa qua sử dụng.',
  },
  {
    id: 'shipping',
    title: 'Chính sách giao hàng',
    image: '/images/chinhsachgiaohang.png',
    desc: 'Giao hàng toàn quốc, kiểm tra hàng trước khi nhận và hỗ trợ theo dõi đơn hàng.',
  },
]

// ------ Hàm/Component Policy ------
const Policy = () => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-sm font-extrabold uppercase tracking-widest text-[#ff6c05]">
          Trung tâm chính sách
        </p>

        <h1 className="mt-2 text-4xl font-extrabold text-blue-950">
          Chính sách KienShoes
        </h1>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {policies.map((item) => (
            <Link
              key={item.id}
              to={`/policy/${item.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full rounded-2xl object-cover"
              />

              <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

// ===== EXPORTS =====

export default Policy