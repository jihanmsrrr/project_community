import React, { useEffect, useState } from "react";
import Skeleton from "./Skeleton";

interface DataItem {
  id: number;
  title: string;
  description: string;
}

export default function DataPage() {
  const [data, setData] = useState<DataItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data 2 detik
    const timer = setTimeout(() => {
      setData([
        { id: 1, title: "Judul 1", description: "Deskripsi singkat 1" },
        { id: 2, title: "Judul 2", description: "Deskripsi singkat 2" },
        { id: 3, title: "Judul 3", description: "Deskripsi singkat 3" },
      ]);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Daftar Data</h1>

      {loading
        ? // Tampilkan skeleton jika loading
          Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="mb-6">
                <Skeleton width="w-3/4" height="h-6" radius="rounded-md" />
                <Skeleton width="w-full" height="h-4" radius="rounded" />
              </div>
            ))
        : // Tampilkan data kalau sudah selesai loading
          data?.map((item) => (
            <div key={item.id} className="mb-6">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
    </div>
  );
}
