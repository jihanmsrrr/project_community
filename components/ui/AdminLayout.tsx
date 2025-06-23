// FILE: components/ui/AdminLayout.tsx
"use client";

// --- PERUBAHAN KUNCI: Impor hook yang kita butuhkan ---
import React, { useState, SVGProps } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext"; // Impor useAuth sebagai sumber data utama
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  BookOpen,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Data Menu Sidebar (tidak ada perubahan)
const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
  {
    label: "Varia Statistik",
    href: "/admin/varia-statistik",
    icon: <Newspaper />,
  },
  { label: "Organisasi", href: "/admin/organisasi", icon: <Briefcase /> },
  { label: "Ruang Baca", href: "/admin/ruang-baca", icon: <BookOpen /> },
  { label: "Pengguna", href: "/admin/pengguna", icon: <Users /> },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: <Settings /> },
];

// Komponen Item Sidebar (tidak ada perubahan)
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
}) => (
  <Link href={href} legacyBehavior>
    <a
      className={`flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
        isActive
          ? "bg-brand-primary/10 text-brand-primary font-semibold"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<SVGProps<SVGSVGElement>>, {
        className: "w-5 h-5 mr-3 flex-shrink-0",
      })}
      <span className="flex-grow">{label}</span>
    </a>
  </Link>
);

// --- Komponen Layout Utama Admin ---
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  // --- PERUBAHAN KUNCI: Gunakan state dari AuthContext, bukan state lokal ---
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- DIHAPUS ---
  // State dan useEffect untuk verifikasi manual tidak lagi ada di sini.
  // Ini mencegah redirect yang salah dan menyederhanakan komponen.

  // --- PERUBAHAN KUNCI: Fungsi logout sekarang memanggil fungsi dari context ---
  const handleLogout = () => {
    logout(); // Fungsi ini sudah menangani clear session dan redirect ke /login
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-card rounded-xl shadow-sm border border-ui-border/50">
      <div className="p-4 border-b border-ui-border/50 text-center">
        <Link href="/admin" legacyBehavior>
          <a className="flex items-center justify-center gap-2 group">
            <div className="text-brand-primary group-hover:text-brand-primary-hover transition-colors">
              <ShieldCheck size={32} />
            </div>
            <span className="font-bold text-lg text-text-primary group-hover:text-brand-primary transition-colors">
              Admin Panel
            </span>
          </a>
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-1">
        {adminMenuItems.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={
              router.pathname === item.href ||
              (item.href !== "/admin" && router.pathname.startsWith(item.href))
            }
          />
        ))}
      </nav>
      <div className="p-4 border-t border-ui-border/50">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-text-on-brand font-bold text-lg">
            {/* PERUBAHAN KUNCI: Ambil data dari currentUser yang disediakan context */}
            {currentUser?.nama?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-text-primary">
              {currentUser?.nama || "Admin"}
            </p>
            <p className="text-xs text-text-secondary">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-feedback-error-text hover:bg-feedback-error-bg rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  // --- PERUBAHAN KUNCI ---
  // Tidak ada lagi logika "isVerifying" atau "if(!username)".
  // Komponen ini sekarang selalu me-render layout, dan menyerahkan
  // urusan proteksi rute kepada komponen `children` (halaman).
  return (
    <div className="bg-surface-background min-h-screen">
      <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 py-8">
          <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="hidden md:block sticky top-8">
              <SidebarContent />
            </div>
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex justify-between items-center w-full p-3 bg-surface-card rounded-lg shadow-sm"
              >
                <span className="font-semibold text-text-primary">
                  Menu Admin
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-text-secondary transition-transform ${
                    isSidebarOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2"
                  >
                    <SidebarContent />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
          <main className="flex-grow min-w-0 bg-surface-card rounded-xl shadow-sm border border-ui-border/50 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
