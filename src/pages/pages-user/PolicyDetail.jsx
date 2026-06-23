// ===== IMPORTS =====

import { Link, useParams } from 'react-router-dom'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Đối tượng cấu hình/dữ liệu policy data ------
const policyData = {
  warranty: {
    label: 'KIENSHOES POLICY',
    title: 'Chính sách bảo hành',
    desc: 'KienShoes hỗ trợ bảo hành đối với các sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất trong quá trình sử dụng bình thường.',
    contents: [
      'Bảo hành áp dụng cho lỗi bung keo, lỗi đường may hoặc lỗi kỹ thuật do nhà sản xuất.',
      'Sản phẩm cần còn hóa đơn mua hàng hoặc thông tin đơn hàng trên hệ thống.',
      'Không bảo hành với trường hợp rách, trầy xước, vào nước, biến dạng do sử dụng sai cách.',
      'Thời gian xử lý bảo hành phụ thuộc vào tình trạng sản phẩm và kết quả kiểm tra thực tế.',
    ],
  },
  return: {
    label: 'KIENSHOES POLICY',
    title: 'Chính sách đổi trả',
    desc: 'Khách hàng được hỗ trợ đổi size, đổi màu hoặc đổi sản phẩm khi sản phẩm đáp ứng đúng điều kiện đổi trả.',
    contents: [
      'Sản phẩm còn nguyên tem, hộp, phụ kiện đi kèm và chưa qua sử dụng ngoài trời.',
      'Hỗ trợ đổi size hoặc đổi màu trong vòng 7 ngày kể từ ngày nhận hàng.',
      'Không áp dụng đổi trả với sản phẩm đã qua sử dụng, dơ bẩn, mất hộp hoặc hư hỏng do người dùng.',
      'Khách hàng cần giữ hóa đơn hoặc thông tin đơn hàng để KienShoes hỗ trợ kiểm tra.',
    ],
  },
  shipping: {
    label: 'KIENSHOES POLICY',
    title: 'Chính sách giao hàng',
    desc: 'KienShoes hỗ trợ giao hàng toàn quốc, cho phép khách hàng kiểm tra sản phẩm trước khi nhận hàng.',
    contents: [
      'Giao hàng toàn quốc thông qua các đơn vị vận chuyển phù hợp với từng khu vực.',
      'Thời gian giao hàng dự kiến từ 2 đến 5 ngày tùy địa chỉ nhận hàng.',
      'Khách hàng được kiểm tra ngoại quan sản phẩm trước khi thanh toán hoặc nhận hàng.',
      'Nếu đơn hàng bị chậm, thất lạc hoặc giao sai sản phẩm, KienShoes sẽ hỗ trợ xử lý sớm nhất.',
    ],
  },
}

// ------ Hàm/Component PolicyDetail ------
const PolicyDetail = () => {

  // ------ Khai báo const nhóm giá trị ------
  const { type } = useParams()

  // ------ Khai báo const policy ------
  const policy = policyData[type]

  if (!policy) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold">Không tìm thấy chính sách</h1>
        <Link to="/policy" className="mt-4 inline-block text-[#ff6c05]">
          Quay lại chính sách
        </Link>
      </main>
    )
  }

  // ===== RENDER GIAO DIỆN =====

  return (
    <main className="bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          to="/policy"
          className="mb-6 bg-orange-100 p-2 rounded-xl inline-block text-sm font-bold text-[#ff6c05] hover:bg-orange-200 duration-100"
        >
          Quay lại chính sách
        </Link>

        <section className="rounded-[32px] border border-slate-900 bg-white p-8 md:p-12">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#ff6c05]">
            {policy.label}
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-blue-950 md:text-5xl">
            {policy.title}
          </h1>

          <p className="mt-5 leading-8 text-slate-500">
            {policy.desc}
          </p>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Nội dung chính
            </h2>

            <ul className="mt-5 space-y-4 text-slate-600">
              {policy.contents.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Mọi thắc mắc vui lòng liên hệ hotline:{' '}
            <a href='tel:18001234' className="font-bold text-[#ff6c05] hover:text-red-600 duration-150">1800 1234</a>{' '}
            để được hỗ trợ. Xin cảm ơn quý khách.
          </p>
        </section>
      </div>
    </main>
  )
}

// ===== EXPORTS =====

export default PolicyDetail