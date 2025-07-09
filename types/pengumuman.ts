export interface Pengumuman {
  id: number;
  judul: string;
  gambarUrl: string;
  isiPengumuman: string;
  targetUrl: string;
  tanggalMulai: Date;
  tanggalBerakhir: Date;
  aktif: boolean;
  createdAt: Date;
  updatedAt: Date;
}