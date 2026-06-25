// ===== IMPORTS =====

import { Link } from "react-router-dom";

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ------ Hàm/Component Footer ------
const Footer = () => {
  // ===== RENDER GIAO DIỆN =====

  return (
    <footer className="mt-16  shadow-sm bg-white backdrop-blur-2xl text-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 grid-cols-1 lg:grid-cols-4">
        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logoWeb.png"
              alt="logo KienShoes"
              className="w-15"
            />
            <p className="text-2xl font-black text-orange-500">
              Kien<span className="text-2xl font-black text-black">Shoes</span>
            </p>
          </Link>

          <p className="mt-4 leading-7 text-black font-medium">
            Chuyên cung cấp giày Sneaker chính hãng với nhiều mẫu mã, nhiều
            thương hiệu và nhiều chương trình ưu đãi hấp dẫn.
          </p>
        </div>

        {/* Lien ket */}
        <div className="lg:mx-auto">
          <h3 className="mb-5 text-lg font-bold">Liên kết</h3>

          <ul className="space-y-3 font-medium">
            <li>
              <Link
                to="/"
                className="transition flex gap-1 items-center hover:text-orange-500"
              >
                <i class="fa-solid fa-house text-orange-500"></i>
                <p>Trang chủ</p>
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition flex gap-1 items-center hover:text-orange-500"
              >
                <i class="fa-solid fa-shoe-prints text-orange-500"></i>
                <p>Sản phẩm</p>
              </Link>
            </li>

            <li>
              <Link
                to="/promotions"
                className="transition flex gap-1 items-center hover:text-orange-500"
              >
                <i class="fa-solid fa-gift text-orange-500"></i>
                <p>Ưu đãi</p>
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className="transition flex gap-1 items-center hover:text-orange-500"
              >
                <i class="fa-solid fa-building-shield text-orange-500"></i>
                <p>Chính sách</p>
              </Link>
            </li>
          </ul>
        </div>

        {/* Chi nhanh */}
        <div className="lg:mx-auto">
          <h3 className="mb-5 text-lg font-bold">Chi nhánh</h3>

          <ul className="space-y-3 font-medium">
            <li>
              <a
                href="http://google.com/maps/place/Biti's/@10.8360118,106.6425689,15z/data=!4m10!1m2!2m1!1zQml0aSdzIGfDsiB24bqlcA!3m6!1s0x317529a7f9818c11:0x8d525a9875873018!8m2!3d10.8360118!4d106.6605933!15sChBCaXRpJ3MgZ8OyIHbhuqVwIgOIAQFaEiIQYml0aSdzIGfDsiB24bqlcJIBCnNob2Vfc3RvcmWaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnRHVFZOc2FEUmxXRXBLWWxoa1dsbHVWbkJPVjJzMVpVVktkVlJ1WXhBQuABAPoBBAgAEDg!16s%2Fg%2F11clvnlvp6?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-orange-500"
              >
                <i className="fa-solid fa-location-dot mt-1 text-orange-500"></i>

                <span>
                  Cửa hàng
                  <br />
                  Gò Vấp, TP. Hồ Chí Minh
                </span>
              </a>
            </li>

            <li>
              <a
                href="https://www.google.com/maps/place/Biti's/@10.8024541,106.6185877,16z/data=!4m6!3m5!1s0x31752bfd42b5a05f:0xb566fff1ef837b7a!8m2!3d10.8026089!4d106.628124!16s%2Fg%2F1hc8wpylt?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-orange-500"
              >
                <i className="fa-solid fa-location-dot mt-1 text-orange-500"></i>

                <span>
                  Cửa hàng
                  <br />
                  Tân phú, TP. Hồ Chí Minh
                </span>
              </a>
            </li>

            <li>
              <a
                href="https://www.google.com/maps/search/Biti's+Nguy%E1%BB%85n+Th%E1%BB%8B+T%C3%BA+B%C3%ACnh+T%C3%A2n,+H%E1%BB%93+Ch%C3%AD+Minh/@10.8153079,106.5859271,16z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-orange-500"
              >
                <i className="fa-solid fa-location-dot mt-1 text-orange-500"></i>

                <span>
                  Cửa hàng
                  <br />
                  Bình Tân, TP. Hồ Chí Minh
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Lien he */}
        <div className="lg:mx-auto">
          <h3 className="mb-5 text-lg font-bold">Liên hệ</h3>

          <div className="space-y-4 font-medium">
            <a
              href="tel:0900123456"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <i className="fa-solid fa-phone text-orange-500"></i>

              <span>Hostline: 0900 123 456</span>
            </a>

            <a
              href="tel:18001234"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <i class="fa-solid fa-headphones text-orange-500"></i>

              <span>CSKH: 18001234</span>
            </a>

            <a
              href="mailto:support@kienshoes.com"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <i className="fa-solid fa-envelope text-orange-500"></i>

              <span>support@kienshoes.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} KienShoes. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-blue-500"
            >
              <i className="fa-brands fa-facebook text-xl"></i>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-pink-500"
            >
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-red-500"
            >
              <i className="fa-brands fa-youtube text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ===== EXPORTS =====

export default Footer;
