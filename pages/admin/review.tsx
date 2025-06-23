import React, { useEffect, useState } from "react";

interface Berita {
  id: number;
  judul: string | string[];
  kategori: string | string[];
  status: string | string[];
}

export default function ReviewBerita() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi approve berita (ubah status jadi published)
  const approveBerita = async (id: number) => {
    const res = await fetch("/api/berita", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "published" }),
    });

    if (res.ok) {
      alert("Berita disetujui dan dipublikasikan.");
      // Refresh list dengan menghapus berita yang sudah dipublish
      setBeritaList((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert("Gagal update status berita");
    }
  };

  useEffect(() => {
    fetch("/api/berita")
      .then((res) => res.json())
      .then((data) => {
        setBeritaList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (beritaList.length === 0) return <p>Tidak ada berita untuk direview.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Review Berita</h1>
      <ul>
        {beritaList
          .filter((b) =>
            Array.isArray(b.status)
              ? b.status.includes("pending_review")
              : b.status === "pending_review"
          )
          .map((b) => (
            <li key={b.id} className="mb-4 p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">
                {Array.isArray(b.judul) ? b.judul[0] : b.judul}
              </h2>
              <p>
                Kategori: {Array.isArray(b.kategori) ? b.kategori[0] : b.kategori}
              </p>
              <p>Status: {Array.isArray(b.status) ? b.status[0] : b.status}</p>
              <button
                onClick={() => approveBerita(b.id)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Setujui dan Publikasikan
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
