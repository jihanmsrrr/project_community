// utils/mapper.ts

import type { ArtikelBerita, NewsCardItem } from "@/types/varia";

// Fungsi utilitas ini bisa Anda letakkan di sini agar bisa dipakai di banyak tempat
const getCategoryColorClasses = (kategori: string) => {
    const kat = kategori.toLowerCase();
    if (kat.includes("bps terkini")) return { categoryColor: "text-blue-600 dark:text-blue-400", categoryBgColor: "bg-blue-500", categoryHoverColor: "hover:text-blue-700", placeholderTextColor: "text-white" };
    if (kat.includes("berita daerah")) return { categoryColor: "text-green-600 dark:text-green-400", categoryBgColor: "bg-green-500", categoryHoverColor: "hover:text-green-700", placeholderTextColor: "text-white" };
    if (kat.includes("serba serbi")) return { categoryColor: "text-sky-600 dark:text-sky-400", categoryBgColor: "bg-sky-500", categoryHoverColor: "hover:text-sky-700", placeholderTextColor: "text-white" };
    if (kat.includes("fotogenik")) return { categoryColor: "text-pink-600 dark:text-pink-400", categoryBgColor: "bg-pink-500", categoryHoverColor: "hover:text-pink-700", placeholderTextColor: "text-white" };
    if (kat.includes("wisata")) return { categoryColor: "text-purple-600 dark:text-purple-400", categoryBgColor: "bg-purple-500", categoryHoverColor: "hover:text-purple-700", placeholderTextColor: "text-white" };
    if (kat.includes("opini")) return { categoryColor: "text-orange-600 dark:text-orange-400", categoryBgColor: "bg-orange-500", categoryHoverColor: "hover:text-orange-700", placeholderTextColor: "text-white" };
    return { categoryColor: "text-indigo-600 dark:text-indigo-400", categoryBgColor: "bg-indigo-500", categoryHoverColor: "hover:text-indigo-700", placeholderTextColor: "text-white" };
};

export const mapArtikelToNewsCardItem = (artikel: ArtikelBerita): NewsCardItem => {
    const styles = getCategoryColorClasses(artikel.kategori);
    const originalDate = new Date(artikel.savedAt);
    const safeBgColor = styles.categoryBgColor.replace("bg-", "");
    const safePlaceholderTextColor = styles.placeholderTextColor.replace("text-", "");

    const imageUrl = artikel.gambarFiles.length > 0 && artikel.gambarFiles[0].url
        ? artikel.gambarFiles[0].url
        : `https://placehold.co/800x500/${safeBgColor}/${safePlaceholderTextColor}?text=${encodeURIComponent(artikel.judul)}&font=Inter`;

    return {
        id: artikel.id.toString(),
        title: artikel.judul,
        excerpt: artikel.abstrak,
        category: artikel.kategori,
        author: artikel.namaPenulis,
        date: originalDate,
        displayDate: originalDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }),
        link: `/varia-statistik/artikel/${artikel.id}`,
        imageUrl: imageUrl,
        authorImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(artikel.namaPenulis)}&background=random&size=32&color=fff&font-size=0.45`,
        views: null, // Anda bisa isi dengan data asli jika ada
        comments: null, // Anda bisa isi dengan data asli jika ada
        ...styles,
    };
};