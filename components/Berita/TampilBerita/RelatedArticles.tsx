import React from "react";
import Image from "next/image"; // Import the Image component

const items = [
  { title: "Warna Data dalam Statistik", img: "warna.png" },
  { title: "Monitor Terbaik 2025", img: "monitor.png" },
  { title: "Mobil Listrik Masa Depan", img: "car.png" },
  { title: "Data Kuliner Nasional", img: "food.png" },
];

const RelatedArticles = () => {
  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Artikel Lainnya
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <article
            key={idx}
            className="border border-gray-300 rounded-lg p-4 text-center transition-shadow hover:shadow-lg cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`Baca artikel: ${item.title}`}
          >
            {/* Replace img tag with Image component */}
            <Image
              src={`/${item.img}`} // Ensure the path is correct relative to your public directory
              alt={item.title}
              width={500} // You might need to adjust these values based on your layout
              height={300} // You might need to adjust these values based on your layout
              className="w-full h-auto rounded-md mb-3 object-cover"
            />
            <p className="text-gray-700 font-medium">{item.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
