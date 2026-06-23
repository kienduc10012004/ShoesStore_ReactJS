// ===== THIẾT LẬP MODULE =====

// ------ Hàm/Component Search ------
const Search = ({ searchText, onChangeSearchText }) => {

  // ===== RENDER GIAO DIỆN =====

  return (
    <input
      value={searchText}
      onChange={(event) => onChangeSearchText(event.target.value)}
      placeholder="Tìm kiếm giày..."
      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
    />
  )
}

// ===== EXPORTS =====

export default Search
