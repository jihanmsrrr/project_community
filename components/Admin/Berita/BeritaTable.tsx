// components/Admin/Berita/BeritaTable.tsx
"use client";

import React from "react";
import {
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  FileWarning,
  Send,
} from "lucide-react";

// Tipe ini bisa diimpor dari file tipe global Anda
interface ArtikelBerita {
  news_id: bigint;
  judul: string;
  updatedAt: string;
  status: "pending_review" | "published" | "revision" | "draft";
  penulis: {
    nama_lengkap: string | null;
  } | null;
}
type BeritaStatus = Exclude<ArtikelBerita["status"], "draft">;

interface BeritaTableProps {
  data: ArtikelBerita[];
  isLoading?: boolean;
  onEdit: (berita: ArtikelBerita) => void;
  onDelete: (id: bigint) => void;
  onApprove: (id: bigint) => void;
  onRequestRevision: (id: bigint) => void;
}

const BeritaTable: React.FC<BeritaTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onApprove,
  onRequestRevision,
}) => {
  const getStatusBadge = (status: BeritaStatus) => {
    switch (status) {
      case "pending_review":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            <Clock size={14} /> Menunggu
          </span>
        );
      case "published":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            <CheckCircle size={14} /> Tayang
          </span>
        );
      case "revision":
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
            <FileWarning size={14} /> Revisi
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-4 bg-surface-page rounded-lg animate-pulse"
          >
            <div className="h-5 w-2/5 bg-ui-border rounded-md"></div>
            <div className="ml-auto h-5 w-1/5 bg-ui-border rounded-md"></div>
            <div className="ml-4 h-5 w-1/5 bg-ui-border rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-center text-text-secondary py-8">
        Tidak ada berita yang cocok dengan filter ini.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-secondary uppercase bg-surface-page">
          <tr>
            <th className="px-6 py-3">Judul</th>
            <th className="px-6 py-3">Penulis</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Terakhir Diubah</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={String(item.news_id)}
              className="bg-surface-card border-b border-ui-border hover:bg-surface-hover"
            >
              <td className="px-6 py-4 font-medium text-text-primary">
                {item.judul}
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {item.penulis?.nama_lengkap || "N/A"}
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(item.status as BeritaStatus)}
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {new Date(item.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end items-center gap-2">
                  {item.status !== "published" && (
                    <button
                      onClick={() => onApprove(item.news_id)}
                      title="Setujui & Publikasikan"
                      className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                    >
                      <Send size={16} />
                    </button>
                  )}
                  {item.status !== "revision" && (
                    <button
                      onClick={() => onRequestRevision(item.news_id)}
                      title="Minta Revisi"
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-md"
                    >
                      <FileWarning size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    title="Edit"
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.news_id)}
                    title="Hapus"
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeritaTable;
