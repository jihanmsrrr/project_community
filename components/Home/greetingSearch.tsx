import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const GreetingSearch: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User";
    setUserName(storedName);
  }, []);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const newsList = [
    "Ekonomi Indonesia Meningkat",
    "Statistik Penduduk 2024",
    "Pembangunan di Kota Cirebon",
    "Kebijakan Baru BPS",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      const filtered = newsList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    alert(`Mencari: ${query}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 text-white text-center">
      <h1 className="text-4xl font-semibold mb-3 font-sans">{`Hello, ${userName}!`}</h1>
      <p className="text-lg font-normal mb-6 font-sans">Selamat datang di BPS Community</p>

      {/* Search bar */}
      <div className="flex items-center bg-white rounded-lg shadow-md max-w-full mx-auto overflow-hidden">
        <input
          type="text"
          placeholder="Cari berita terkini..."
          value={query}
          onChange={handleChange}
          className="flex-grow text-gray-900 text-base font-sans px-6 py-3 outline-none"
          aria-label="Search news"
        />
        <button
          onClick={handleSearch}
          className="bg-[#003366] hover:bg-[#002244] transition-colors duration-200 px-6 py-3 flex items-center justify-center cursor-pointer"
          aria-label="Search"
        >
          <Search size={20} color="white" />
        </button>
      </div>

      {/* Suggestions list */}
      {suggestions.length > 0 && (
        <ul className="mt-2 bg-white text-gray-900 rounded-md border border-gray-300 shadow-sm max-w-3xl mx-auto text-left overflow-hidden">
          {suggestions.map((news, idx) => (
            <li
              key={idx}
              className="px-6 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
              tabIndex={0}
              role="option"
              aria-selected={false}
              onClick={() => {
                setQuery(news);
                setSuggestions([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setQuery(news);
                  setSuggestions([]);
                }
              }}
            >
              {news}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GreetingSearch;
