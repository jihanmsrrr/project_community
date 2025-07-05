// pages/profil.tsx
"use client"; // Pastikan ini adalah Client Component

import React, { useState, useEffect } from "react";
// --- PERUBAHAN: Impor komponen Image dari Next.js ---
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  LoaderCircle,
  User as UserIcon,
  Briefcase,
  Calendar,
  GraduationCap,
  Building,
  Clock,
  AlertCircle,
  Mail,
  MapPin,
  VenetianMask as Gender,
  Award,
  Users,
} from "lucide-react";

// Interface untuk struktur data profil pengguna dari API
interface UserProfile {
  user_id: number;
  nama_lengkap: string;
  nip_baru: string | null;
  nip_lama: string | null;
  email: string;
  role: string;
  sso_id: string | null;
  foto_url: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: Date | null;
  jenis_kelamin: string | null;
  status_kepegawaian: string | null;
  tmt_pns: Date | null;
  pangkat_golongan: string | null;
  tmt_pangkat_golongan: Date | null;
  jabatan_struktural: string | null;
  jenjang_jabatan_fungsional: string | null;
  tmt_jabatan: Date | null;
  pendidikan_terakhir: string | null;
  masa_kerja_golongan: string | null;
  masa_kerja_total: string | null;
  tanggal_pensiun: Date | null;
  sisa_masa_kerja: string | null;
  grade: string | null;
  unit_kerja_eselon1: string | null;
  unit_kerja_eselon2: string | null;
  username: string;
}

const ProfilPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && !userProfile && loadingProfile) {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch("/api/profile");
          if (!res.ok) {
            if (res.status === 401) {
              router.push("/login");
              return;
            }
            throw new Error(`Failed to fetch profile: ${res.statusText}`);
          }
          const data: UserProfile = await res.json();
          // Konversi tanggal string ke objek Date jika diperlukan
          if (data.tanggal_lahir)
            data.tanggal_lahir = new Date(data.tanggal_lahir);
          if (data.tmt_pns) data.tmt_pns = new Date(data.tmt_pns);
          if (data.tmt_pangkat_golongan)
            data.tmt_pangkat_golongan = new Date(data.tmt_pangkat_golongan);
          if (data.tmt_jabatan) data.tmt_jabatan = new Date(data.tmt_jabatan);
          if (data.tanggal_pensiun)
            data.tanggal_pensiun = new Date(data.tanggal_pensiun);

          setUserProfile(data);
          setLoadingProfile(false);
        } catch (err: unknown) {
          console.error("Error fetching profile:", err);
          if (err instanceof Error) {
            setErrorProfile(err.message || "Gagal memuat data profil.");
          } else {
            setErrorProfile("Gagal memuat data profil.");
          }
          setLoadingProfile(false);
        }
      };
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, userProfile, loadingProfile, router]);

  if (status === "loading" || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page">
        <LoaderCircle className="animate-spin w-10 h-10 text-brand-primary" />
      </div>
    );
  }

  if (!session || errorProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page text-status-red-dark">
        <AlertCircle className="w-6 h-6 mr-2" />
        {errorProfile ||
          "Anda tidak memiliki akses ke halaman ini atau sesi Anda telah berakhir. Silakan login kembali."}
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-page text-status-red-dark">
        <AlertCircle className="w-6 h-6 mr-2" />
        {"Data profil tidak tersedia. Silakan coba lagi."}
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Tidak Tersedia";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const ProfileItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
  }> = ({ icon, label, value }) => (
    <div className="flex items-center mb-3">
      <div className="text-brand-primary mr-3 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="text-base text-text-primary">
          {value || "Tidak Tersedia"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      {/* Hero Section */}
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center pt-20 sm:pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="relative text-center z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            Profil Saya
          </h1>
          <p className="text-white text-lg sm:text-xl mt-2 opacity-90">
            Informasi Lengkap Pegawai
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20 pb-10">
        <div className="bg-surface-card rounded-3xl shadow-2xl p-6 sm:p-8 border border-ui-border-faded">
          {/* Bagian Foto Profil dan Info Dasar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-6 border-b border-ui-border">
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-white dark:border-gray-800">
              {userProfile.foto_url ? (
                // --- PERUBAHAN: Menggunakan komponen Image dari Next.js ---
                <Image
                  src={userProfile.foto_url}
                  alt="Foto Profil"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 160px"
                />
              ) : (
                <UserIcon
                  size={80}
                  className="text-gray-400 dark:text-gray-500"
                />
              )}
            </div>
            <div className="text-center sm:text-left flex-grow pt-4">
              <h2 className="text-3xl font-bold text-text-primary leading-tight">
                {userProfile.nama_lengkap}
              </h2>
              <p className="text-brand-primary font-semibold capitalize text-lg mt-1">
                {userProfile.role}
              </p>
              <p className="text-text-secondary mt-2 flex items-center justify-center sm:justify-start gap-2">
                <Mail size={18} /> {userProfile.email}
              </p>
              {userProfile.nip_baru && (
                <p className="text-text-secondary text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
                  NIP: {userProfile.nip_baru}
                </p>
              )}
              {userProfile.username && (
                <p className="text-text-secondary text-sm mt-1 flex items-center justify-center sm:justify-start gap-2">
                  Username: {userProfile.username}
                </p>
              )}
            </div>
          </div>

          {/* Grid Detail Informasi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Informasi Pribadi & Pendidikan */}
            <div className="lg:col-span-1">
              <SectionCard title="Informasi Pribadi">
                <ProfileItem
                  icon={<MapPin size={20} />}
                  label="Tempat, Tanggal Lahir"
                  value={`${
                    userProfile.tempat_lahir || "Tidak Tersedia"
                  }, ${formatDate(userProfile.tanggal_lahir)}`}
                />
                <ProfileItem
                  icon={<Gender size={20} />}
                  label="Jenis Kelamin"
                  value={userProfile.jenis_kelamin}
                />
                <ProfileItem
                  icon={<Briefcase size={20} />}
                  label="Status Kepegawaian"
                  value={userProfile.status_kepegawaian}
                />
                <ProfileItem
                  icon={<Calendar size={20} />}
                  label="TMT PNS"
                  value={formatDate(userProfile.tmt_pns)}
                />
                <ProfileItem
                  icon={<GraduationCap size={20} />}
                  label="Pendidikan Terakhir"
                  value={userProfile.pendidikan_terakhir}
                />
              </SectionCard>
            </div>

            {/* Kolom Tengah: Jabatan & Pangkat */}
            <div className="lg:col-span-1">
              <SectionCard title="Jabatan & Pangkat">
                <ProfileItem
                  icon={<Briefcase size={20} />}
                  label="Pangkat/Golongan"
                  value={userProfile.pangkat_golongan}
                />
                <ProfileItem
                  icon={<Calendar size={20} />}
                  label="TMT Pangkat/Golongan"
                  value={formatDate(userProfile.tmt_pangkat_golongan)}
                />
                <ProfileItem
                  icon={<Briefcase size={20} />}
                  label="Jabatan Struktural"
                  value={userProfile.jabatan_struktural}
                />
                <ProfileItem
                  icon={<Briefcase size={20} />}
                  label="Jenjang Fungsional"
                  value={userProfile.jenjang_jabatan_fungsional}
                />
                <ProfileItem
                  icon={<Calendar size={20} />}
                  label="TMT Jabatan"
                  value={formatDate(userProfile.tmt_jabatan)}
                />
              </SectionCard>
            </div>

            {/* Kolom Kanan: Masa Kerja, Unit Kerja & Pensiun */}
            <div className="lg:col-span-1">
              <SectionCard title="Masa Kerja & Organisasi">
                <ProfileItem
                  icon={<Clock size={20} />}
                  label="Masa Kerja Golongan"
                  value={userProfile.masa_kerja_golongan}
                />
                <ProfileItem
                  icon={<Clock size={20} />}
                  label="Masa Kerja Total"
                  value={userProfile.masa_kerja_total}
                />
                <ProfileItem
                  icon={<Building size={20} />}
                  label="Unit Kerja Eselon 1"
                  value={userProfile.unit_kerja_eselon1}
                />
                <ProfileItem
                  icon={<Building size={20} />}
                  label="Unit Kerja Eselon 2"
                  value={userProfile.unit_kerja_eselon2}
                />
                <ProfileItem
                  icon={<Award size={20} />}
                  label="Grade"
                  value={userProfile.grade}
                />
                <ProfileItem
                  icon={<Users size={20} />}
                  label="SSO ID"
                  value={userProfile.sso_id}
                />
              </SectionCard>

              {/* Bagian Pensiun (bisa jadi kartu terpisah atau di bawah Masa Kerja) */}
              <SectionCard title="Informasi Pensiun" className="mt-8">
                <ProfileItem
                  icon={<Calendar size={20} />}
                  label="Tanggal Pensiun"
                  value={formatDate(userProfile.tanggal_pensiun)}
                />
                <ProfileItem
                  icon={<Clock size={20} />}
                  label="Sisa Masa Kerja"
                  value={userProfile.sisa_masa_kerja}
                />
              </SectionCard>
            </div>
          </div>

          {/* Bagian "Sidebar di Bawahnya" - Contoh Informasi Tambahan */}
          <div className="mt-10 p-6 bg-surface-header rounded-2xl shadow-inner border border-ui-border-faded">
            <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle size={20} /> Informasi Tambahan
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Bagian ini dapat digunakan untuk menampilkan informasi dinamis
              lainnya seperti riwayat pelatihan, sertifikasi, atau pencapaian
              terbaru. Ini juga bisa menjadi area untuk tautan cepat ke sumber
              daya internal yang relevan dengan pengguna.
            </p>
            <ul className="list-disc list-inside text-text-secondary mt-3 space-y-1">
              <li>Aktivitas terakhir: Mengakses Ruang Baca (2 jam lalu)</li>
              <li>Status kehadiran: Online</li>
              <li>Nomor Telepon Kantor: (021) 1234567</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;

// Helper Component untuk Card Section
const SectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div
    className={`bg-surface-card p-6 rounded-2xl shadow-md border border-ui-border-faded ${
      className || ""
    }`}
  >
    <h3 className="text-xl font-semibold text-text-primary border-b pb-3 mb-4 border-ui-border">
      {title}
    </h3>
    {children}
  </div>
);
