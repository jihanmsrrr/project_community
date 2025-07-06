// FILE: pages/admin/index.tsx
"use client";

import React, { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Newspaper,
  Briefcase,
  BookOpen,
  Settings,
  Users,
  ArrowRight,
  BarChart3,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

import type { NextPageWithLayout } from "../_app";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/ui/AdminLayout";
import RekapCard from "@/components/Admin/Berita/RekapCard";

// Komponen lokal (AdminWidgetCard) tidak ada perubahan
interface AdminWidgetCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}
const AdminWidgetCard: React.FC<AdminWidgetCardProps> = ({
  title,
  description,
  icon,
  link,
}) => (
  <motion.div
    whileHover={{
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(var(--brand-primary-rgb), 0.05), 0 4px 6px -4px rgba(var(--brand-primary-rgb), 0.04)",
    }}
    className="bg-surface-card p-6 rounded-xl shadow-md border border-ui-border/50 flex flex-col h-full"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="bg-brand-primary/10 p-3 rounded-lg text-brand-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
    </div>
    <p className="text-sm text-text-secondary flex-grow mb-4">{description}</p>
    <Link href={link} legacyBehavior>
      <a className="mt-auto text-sm font-semibold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 group self-start">
        Kelola{" "}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </a>
    </Link>
  </motion.div>
);

// --- Komponen Utama Halaman Dashboard Admin ---
const AdminDashboardPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { userRole, currentUser, loading } = useAuth();

  console.log("User Role di Admin Dashboard:", userRole);

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-10">
        <p className="text-text-secondary animate-pulse text-lg">
          Memverifikasi akses Anda...
        </p>
      </div>
    );
  }

  if (userRole !== "admin") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      router.push("/login");
    }, [router]);

    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-10">
        <p className="text-feedback-error-text text-lg">
          Akses Ditolak. Mengarahkan ke halaman login...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          Selamat datang kembali,{" "}
          <span className="font-semibold text-text-primary">
            {/* --- PERBAIKAN DI SINI --- */}
            {currentUser?.name || "Admin"}
            {/* --- AKHIR PERBAIKAN --- */}
          </span>
          !
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Ringkasan Aktivitas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <RekapCard
            title="Total Pengguna"
            value={1245}
            icon={<Users size={28} />}
            colorClass="border-status-blue text-status-blue"
          />
          <RekapCard
            title="Artikel Dipublikasi"
            value={89}
            icon={<Newspaper size={28} />}
            colorClass="border-status-green text-status-green"
          />
          <RekapCard
            title="Modul di Ruang Baca"
            value={42}
            icon={<BookOpen size={28} />}
            colorClass="border-status-orange text-status-orange"
          />
          <RekapCard
            title="Aktivitas Hari Ini"
            value={3456}
            icon={<Activity size={28} />}
            colorClass="border-status-red text-status-red"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Panel Manajemen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AdminWidgetCard
            title="Varia Statistik"
            description="Kelola artikel, berita, opini, dan konten lain yang tampil di halaman Varia Statistik."
            icon={<Newspaper size={24} />}
            link="/admin/varia-statistik"
          />
          <AdminWidgetCard
            title="Organisasi"
            description="Perbarui informasi struktur organisasi, detail satuan kerja, dan data pejabat."
            icon={<Briefcase size={24} />}
            link="/admin/organisasi"
          />
          <AdminWidgetCard
            title="Ruang Baca"
            description="Tambah, edit, atau hapus modul, panduan, dan materi lainnya di halaman Ruang Baca."
            icon={<BookOpen size={24} />}
            link="/admin/ruang-baca"
          />
          <AdminWidgetCard
            title="Manajemen Pengguna"
            description="Lihat daftar pengguna, kelola peran (admin/user), dan reset password."
            icon={<Users size={24} />}
            link="/admin/pengguna"
          />
          <AdminWidgetCard
            title="Pengaturan Umum"
            description="Atur nama aplikasi, logo, link media sosial, dan konfigurasi umum lainnya."
            icon={<Settings size={24} />}
            link="/admin/pengaturan"
          />
          <AdminWidgetCard
            title="Analitik Situs"
            description="Lihat statistik pengunjung, halaman populer, dan metrik penting lainnya."
            icon={<BarChart3 size={24} />}
            link="/admin/analitik"
          />
        </div>
      </section>
    </div>
  );
};

AdminDashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDashboardPage;
