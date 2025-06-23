import React from "react";

const items = [
  { title: "Warna Data dalam Statistik", img: "warna.png" },
  { title: "Monitor Terbaik 2025", img: "monitor.png" },
  { title: "Mobil Listrik Masa Depan", img: "car.png" },
  { title: "Data Kuliner Nasional", img: "food.png" },
];

const RelatedArticles = () => {
  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Artikel Lainnya</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <article
            key={idx}
            className="border border-gray-300 rounded-lg p-4 text-center transition-shadow hover:shadow-lg cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`Baca artikel: ${item.title}`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-auto rounded-md mb-3 object-cover"
              loading="lazy"
            />
            <p className="text-gray-700 font-medium">{item.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
