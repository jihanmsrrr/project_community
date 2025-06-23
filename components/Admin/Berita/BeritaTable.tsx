// components/Admin/BeritaTable.tsx
"use client";

import React from "react";
import {
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  FileWarning,
  Eye,
} from "lucide-react";
import type { ArtikelBerita } from "@/types/varia"; // Pastikan path ini benar

type BeritaStatus = "pending_review" | "published" | "draft" | "revision";

interface BeritaTableProps {
  data: ArtikelBerita[];
  isLoading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
}

const BeritaTable: React.FC<BeritaTableProps> = ({
  data,
  isLoading,
  onEdit,
  onDelete,
  onApprove,
}) => {
  const getDisplayValue = (value: string | string[] | undefined): string => {
    return Array.isArray(value) ? value[0] || "" : value || "";
  };

  const getStatusChip = (status: BeritaStatus) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 text-xs font-medium text-status-green-dark bg-status-green/20 rounded-full flex items-center gap-1.5">
            <CheckCircle size={14} /> Tayang
          </span>
        );
      case "pending_review":
        return (
          <span className="px-2 py-1 text-xs font-medium text-status-blue-dark bg-status-blue/20 rounded-full flex items-center gap-1.5">
            <Clock size={14} /> Menunggu Review
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs font-medium text-text-secondary bg-ui-border rounded-full flex items-center gap-1.5">
            <Edit size={14} /> Draf
          </span>
        );
      case "revision":
        return (
          <span className="px-2 py-1 text-xs font-medium text-status-red-dark bg-status-red/20 rounded-full flex items-center gap-1.5">
            <FileWarning size={14} /> Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Tampilan Skeleton saat loading
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-surface-hover animate-pulse rounded-md"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-surface-card divide-y divide-ui-border">
        <thead className="bg-surface-page">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Judul Artikel
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Penulis
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Tanggal Dibuat
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ui-border">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-surface-hover">
                <td className="px-4 py-3 whitespace-normal text-sm font-medium text-text-primary max-w-xs">
                  {getDisplayValue(item.judul)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                  {item.namaPenulis || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                  {new Date(item.savedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex">
                    {getStatusChip(
                      getDisplayValue(item.status) as BeritaStatus
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {getDisplayValue(item.status) === "pending_review" && (
                      <button
                        onClick={() => onApprove(item.id)}
                        title="Setujui & Tayangkan"
                        className="p-2 text-text-secondary hover:text-status-green hover:bg-status-green/10 rounded-full transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item.id)}
                      title="Edit Berita"
                      className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <a
                      href={`/varia-statistik/artikel/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat Berita"
                      className="p-2 text-text-secondary hover:text-status-blue hover:bg-status-blue/10 rounded-full transition-colors"
                    >
                      <Eye size={16} />
                    </a>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Hapus Berita"
                      className="p-2 text-text-secondary hover:text-status-red hover:bg-status-red/10 rounded-full transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-16 text-text-secondary italic"
              >
                <p>Tidak ada berita pada tab ini.</p>
                <p className="text-xs mt-1">
                  Coba pilih tab lain atau bersihkan pencarian.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BeritaTable;
