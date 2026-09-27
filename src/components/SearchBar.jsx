function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <label className="block w-full lg:max-w-sm">
      <span className="sr-only">Search shoes</span>
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search shoes"
        className="w-full rounded-full border border-zinc-300 bg-white px-5 py-3 outline-none transition focus:border-black"
      />
    </label>
  );
}

export default SearchBar;
