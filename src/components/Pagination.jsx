// ===== THIẾT LẬP MODULE =====

// ------ Hàm/Component Pagination ------
const Pagination = ({ currentPage, totalPages, onChangePage }) => {
  if (totalPages <= 1) return null

  // ------ Khai báo const pages ------
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  // ===== RENDER GIAO DIỆN =====

  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        className="rounded-lg cursor-pointer hover:bg-slate-200 duration-100 border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Trước
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChangePage(page)}
          className={`rounded-lg cursor-pointer px-4 py-2 ${page === currentPage ? 'bg-orange-500 text-white' : 'border bg-white hover:bg-slate-200 duration-100'}`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
        className="rounded-lg cursor-pointer hover:bg-slate-200 duration-100 border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sau
      </button>
    </div>
  )
}

// ===== EXPORTS =====

export default Pagination
