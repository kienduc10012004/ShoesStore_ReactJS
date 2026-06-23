// ===== THIẾT LẬP MODULE =====

// ------ Khai báo const policies ------
const policies = [
  {
    id: 1,
    icon: '🛡️',
    title: 'Chính hãng 100%',
    desc: 'Sản phẩm chuẩn hãng',
  },
  {
    id: 2,
    icon: '🔁',
    title: 'Đổi hàng dễ dàng',
    desc: 'Hỗ trợ đổi màu đổi size',
  },
  {
    id: 3,
    icon: '⭐',
    title: 'Uy tín hàng đầu',
    desc: 'Khách hàng tin chọn',
  },
  {
    id: 4,
    icon: '🛡️',
    title: 'Bảo hành 12 tháng',
    desc: 'An tâm sử dụng',
  },
]

// ------ Hàm/Component ServicePolicy ------
const ServicePolicy = () => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3">
      <div className="grid gap-3 md:grid-cols-4">
        {policies.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-lg">
              {item.icon}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== EXPORTS =====

export default ServicePolicy