// ===== IMPORTS =====

import { Link } from 'react-router-dom'
import CountdownTimer from './CountdownTimer.jsx'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Khai báo const services ------
const services = [
  {
    id: 1,
    icon: '🚚',
    title: 'Giao hàng nhanh',
    desc: 'Miễn phí từ 5 triệu',
  },
  {
    id: 2,
    icon: '🛡️',
    title: 'Bảo hành 12 tháng',
    desc: 'Cam kết chính hãng',
  },
  {
    id: 3,
    icon: '🔁',
    title: 'Đổi trả 7 ngày',
    desc: 'Thủ tục đơn giản',
  },
]

// ------ Hàm/Component FlashSale ------
const FlashSale = () => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="space-y-8">
      <div className="hidden md:grid gap-5  md:grid-cols-3">
        {services.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-2xl">{item.icon}</div>

            <h3 className="mt-3 font-bold text-slate-900">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <Link to='/promotions' className="block rounded-[28px] bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white shadow-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 duration-200 transition">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase">
              Flash Sale
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Giảm giá mạnh cho đơn hàng hôm nay
            </h2>
          </div>

          <CountdownTimer targetDate="2026-12-31T23:59:59" />
        </div>
      </Link>
    </div>
  )
}

// ===== EXPORTS =====

export default FlashSale