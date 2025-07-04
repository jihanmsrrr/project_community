// pages/admin/ruang-baca/tambah.tsx
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "../../_app";
import AdminLayout from "@/components/ui/AdminLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormMateri from "./FormMateri"; // Path sudah diperbaiki

const TambahMateriPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query; // Ambil 'id' dari URL query

  return (
    <div className="space-y-6">
      <Link href="/admin/ruang-baca" legacyBehavior>
        <a className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
          <ArrowLeft size={16} /> Kembali ke Manajemen Ruang Baca
        </a>
      </Link>
      <h1 className="text-3xl font-bold text-text-primary">
        {id ? "Edit Materi" : "Tambah Materi Baru"}
      </h1>
      <div className="bg-surface-card p-6 rounded-xl shadow-md">
        {/* Kirim id ke komponen FormMateri */}
        <FormMateri materialId={id as string | undefined} />
      </div>
    </div>
  );
};

TambahMateriPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default TambahMateriPage;
