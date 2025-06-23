import { useState } from "react";
import PageTitle from "@/components/ui/PageTitle";
import Breadcrumb from "@/components/Berita/Submenu/Breadcrumb";

const menuItems = [
  "BPS Terkini",
  "Berita Daerah",
  "Serba Serbi",
  "Fotogenik",
  "Wisata",
  "Opini",
];

const MenuBerita = () => {
  const [active, setActive] = useState(menuItems[0]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSelect = (item: string) => {
    setActive(item);
    setIsMobileOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <PageTitle title="Berita BPS Community" backgroundImage="/title.png" />

      {/* Desktop Menu */}
      <nav className="hidden md:flex justify-center gap-6 mt-5">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            aria-current={active === item ? "true" : undefined}
            onClick={() => handleSelect(item)}
            className={`px-6 py-3 rounded-xl shadow-md transition-transform duration-300 
              ${
                active === item
                  ? "bg-blue-800 text-white shadow-blue-500 scale-105"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:scale-105"
              } focus:outline-none focus:ring-4 focus:ring-blue-400`}
          >
            <span className="font-medium text-lg select-none">{item}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Dropdown */}
      <div className="md:hidden mt-6 relative max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isMobileOpen}
          className="w-full flex justify-between items-center bg-blue-100 text-blue-800 px-5 py-3 rounded-xl shadow-md hover:bg-blue-200 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <span className="font-medium text-lg">{active}</span>
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              isMobileOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMobileOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {menuItems.map((item) => (
              <li
                key={item}
                role="option"
                aria-selected={active === item}
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(item);
                  }
                }}
                className={`cursor-pointer px-5 py-3 transition-colors duration-200 select-none 
                  ${
                    active === item
                      ? "bg-blue-800 text-white"
                      : "hover:bg-blue-100 text-blue-800"
                  }`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Separator Line */}
      <hr className="my-10 border-gray-300" />

      {/* Breadcrumb */}
      <Breadcrumb activeItem={active} />
    </div>
  );
};

export default MenuBerita;
