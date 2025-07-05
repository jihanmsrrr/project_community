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
    const styles = getCategoryColorClasses(artikel.kategori || 'umum');
    const originalDate = artikel.savedAt instanceof Date ? artikel.savedAt : new Date();
    
    const safeBgColor = styles.categoryBgColor.replace("bg-", "");
    const safePlaceholderTextColor = styles.placeholderTextColor.replace("text-", "");

    // PERBAIKAN UTAMA DI SINI: Validasi dan Type Assertion untuk gambar_urls
    let primaryImageUrl: string | null = null;
    if (Array.isArray(artikel.gambar_urls) && artikel.gambar_urls.length > 0) {
        // Asumsikan setiap elemen di gambar_urls adalah objek dengan properti 'url'
        const firstImage = artikel.gambar_urls[0];
        if (typeof firstImage === 'object' && firstImage !== null && 'url' in firstImage) {
            primaryImageUrl = (firstImage as { url: string }).url;
        }
    }

    const imageUrl = primaryImageUrl
        ? primaryImageUrl
        : `https://placehold.co/800x500/${safeBgColor}/${safePlaceholderTextColor}?text=${encodeURIComponent(artikel.judul || 'Berita')}&font=Inter`;

    const authorName = artikel.penulis?.nama_lengkap || artikel.nama_penulis || 'Anonim';
    const authorImageUrl = artikel.penulis?.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&size=32&color=fff&font-size=0.45`;

    return {
        id: artikel.news_id.toString(),
        title: artikel.judul,
        excerpt: artikel.abstrak,
        category: artikel.kategori,
        author: authorName,
        date: originalDate,
        displayDate: originalDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }),
        link: `/varia-statistik/artikel/${artikel.news_id.toString()}`,
        imageUrl: imageUrl,
        authorImageUrl: authorImageUrl,
        views: null, // Data ini perlu diisi dari sumber lain (misal dari kolom hits jika ada)
        comments: null, // Data ini perlu diisi dari sumber lain (misal dari hitungan komentar)
        ...styles,
    };
};