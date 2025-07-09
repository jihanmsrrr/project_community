// FILE: pages/admin/pengumuman.tsx
"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/components/ui/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { NextPageWithLayout } from "../_app";

interface Pengumuman {
  id: number;
  judul: string;
  gambarUrl: string;
  isiPengumuman: string;
  targetUrl: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  aktif: boolean;
}

const PengumumanPage: NextPageWithLayout = () => {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<Pengumuman>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchData = async () => {
    const res = await fetch("/api/pengumuman?all=true");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 1MB");
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log untuk melihat data yang dikirim
    console.log("Form Data yang akan dikirim: ", form);
    console.log("File Gambar: ", imageFile);

    if (!form.judul || !form.tanggalMulai || !form.tanggalBerakhir) {
      toast.error("Judul dan tanggal wajib diisi");
      console.error("Judul dan tanggal wajib diisi");
      return;
    }

    const isEdit = isEditing && form.id;
    const method = isEdit ? "PUT" : "POST";
    const formData = new FormData();

    // Log untuk mengecek jika form data sudah siap
    console.log("Menyusun FormData");
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined) {
        console.log(`Menambahkan ${key}: ${value}`);
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      console.log("Menambahkan gambar ke FormData");
      formData.append("gambar", imageFile);
    }

    try {
      const response = await fetch("/api/pengumuman", {
        method,
        body: formData,
      });

      if (response.ok) {
        toast.success(
          `Pengumuman berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`
        );
        console.log(
          `Pengumuman berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`
        );
        fetchData();
        setForm({});
        setImageFile(null);
        setShowDialog(false);
        setIsEditing(false);
      } else {
        const err = await response.json();
        toast.error(err.error || "Gagal menyimpan pengumuman");
        console.error("Error response: ", err);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim data");
      console.error("Error saat mengirim data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pengumuman ini?")) return;
    const res = await fetch(`/api/pengumuman?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Pengumuman dihapus");
      fetchData();
    } else {
      toast.error("Gagal menghapus pengumuman");
    }
  };

  const handleEdit = (item: Pengumuman) => {
    setForm(item);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleToggleAktif = async (item: Pengumuman) => {
    const res = await fetch("/api/pengumuman", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, aktif: !item.aktif }),
    });
    if (res.ok) {
      toast.success("Status aktif diubah");
      fetchData();
    } else {
      toast.error("Gagal mengubah status aktif");
    }
  };

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          Manajemen Pengumuman
        </h1>
        <div className="flex flex-1 justify-end gap-2">
          <Input
            placeholder="Cari pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Button
            onClick={() => {
              setForm({ aktif: true });
              setShowDialog(true);
              setIsEditing(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-ui-border/50 bg-surface-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Mulai</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-surface-hover">
                <TableCell>{item.judul}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleToggleAktif(item)}>
                    {item.aktif ? "✅ Aktif" : "❌ Tidak"}
                  </Button>
                </TableCell>
                <TableCell>
                  {new Date(item.tanggalMulai).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.tanggalBerakhir).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <DialogHeader>
              {isEditing ? "Edit" : "Tambah"} Pengumuman
            </DialogHeader>
          </div>
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input
                name="judul"
                value={form.judul || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gambar (Max 1MB)</label>
              <Input
                type="file"
                name="gambar"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Isi Pengumuman</label>
              <Input
                name="isiPengumuman"
                value={form.isiPengumuman || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Target URL</label>
              <Input
                name="targetUrl"
                value={form.targetUrl || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input
                type="date"
                name="tanggalMulai"
                value={form.tanggalMulai || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Berakhir</label>
              <Input
                type="date"
                name="tanggalBerakhir"
                value={form.tanggalBerakhir || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">{isEditing ? "Perbarui" : "Simpan"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

PengumumanPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default PengumumanPage;
