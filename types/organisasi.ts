// src/types/organisasi.ts (atau sesuaikan pathnya)
export interface PegawaiPensiun {
  id: string;
  namaPegawai: string;
  avatarInitial?: string; // Misal untuk inisial di avatar
  avatarColor?: string;   // Warna background avatar
  satuanKerja: string;
  tanggalLahir: string; // Format "DD-MM-YYYY"
  umur: number;
  tmtPensiun: string; // Format "DD-MM-YYYY"
  sisaMasaKerja: string;
}