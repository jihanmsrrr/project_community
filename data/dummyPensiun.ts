// src/data/dummyPensiun.ts
// Update the import path below to the actual location of PegawaiPensiun, for example:
import type { PegawaiPensiun } from '../types/organisasi'; // Sesuaikan path jika perlu

const getAvatarDetails = (name: string): { initial: string, color: string } => {
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500", 
    "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-teal-500"
  ];
  const initial = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";
  // Simple hash function to pick a color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  return { initial, color };
};

export const daftarPegawaiPensiun: PegawaiPensiun[] = [
  {
    id: "1",
    namaPegawai: "Lulu Lutfiasari S.Si., M.M",
    satuanKerja: "Kota Blitar",
    tanggalLahir: "10-05-1967",
    umur: 58,
    tmtPensiun: "01-06-2025",
    sisaMasaKerja: "7 hari",
  },
  {
    id: "2",
    namaPegawai: "Dra. Dyah Retnani Parini",
    satuanKerja: "Kota Kediri",
    tanggalLahir: "08-05-1967",
    umur: 58,
    tmtPensiun: "01-06-2025",
    sisaMasaKerja: "7 hari",
  },
  {
    id: "3",
    namaPegawai: "Agus Yani SH.",
    satuanKerja: "Kabupaten Lumajang",
    tanggalLahir: "17-05-1967",
    umur: 58,
    tmtPensiun: "01-06-2025",
    sisaMasaKerja: "7 hari",
  },
  {
    id: "4",
    namaPegawai: "Nursidi",
    satuanKerja: "Kabupaten Jombang",
    tanggalLahir: "08-06-1967",
    umur: 57,
    tmtPensiun: "01-07-2025",
    sisaMasaKerja: "1 bulan 6 hari",
  },
  {
    id: "5",
    namaPegawai: "Ir. Firman Bastian M.Si",
    satuanKerja: "Kabupaten Probolinggo",
    tanggalLahir: "07-06-1967",
    umur: 57,
    tmtPensiun: "01-07-2025",
    sisaMasaKerja: "1 bulan 6 hari",
  },
  // Tambahkan lebih banyak data jika perlu untuk mencapai 100 atau lebih
].map(p => {
  const avatar = getAvatarDetails(p.namaPegawai);
  return { ...p, avatarInitial: avatar.initial, avatarColor: avatar.color };
});