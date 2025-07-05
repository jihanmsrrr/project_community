import React from "react";

const Breadcrumb = ({ activeItem }: { activeItem: string }) => {
  return (
    <div className="text-sm text-gray-500">
      {/* Always show "Berita" */}
      <span
        className={`${
          activeItem === "Berita"
            ? "text-blue-600 font-semibold"
            : "hover:text-gray-700"
        }`}
      >
        Berita
      </span>

      {activeItem && activeItem !== "Berita" && (
        <>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span
            className={`${
              activeItem !== "Berita"
                ? "text-blue-600 font-semibold"
                : "hover:text-gray-700"
            }`}
          >
            {activeItem}
          </span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
