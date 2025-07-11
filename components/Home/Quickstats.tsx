"use client";

import { useState, useEffect } from "react";
import { Newspaper, Users, BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";

// Tipe untuk data statistik yang diterima dari API
interface StatsData {
  beritaBaru: number;
  pegawaiTerdaftar: number;
  dokumenTersedia: number;
}

// Komponen Skeleton untuk kartu statistik
const StatCardSkeleton = () => (
  <div className="bg-surface-card border border-ui-border/50 rounded-xl p-5 flex items-center gap-5 shadow-sm animate-pulse">
    <div className="bg-brand-primary/10 p-4 rounded-lg">
      <div className="w-6 h-6 bg-brand-primary/20 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 w-20 bg-ui-border/50 rounded-md"></div>
      <div className="h-4 w-28 bg-ui-border/50 rounded-md"></div>
    </div>
  </div>
);

const QuickStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // DIPERBAIKI: URL API disesuaikan menjadi '/api/dashboard/main'
        const response = await fetch("/api/dashboard/main");
        if (!response.ok) throw new Error("Gagal mengambil data statistik");
        const data = await response.json();

        // Mengatur state dengan data dari properti 'quickStats'
        setStats(data.quickStats);
      } catch (error) {
        console.error(error);
        // Set stats ke nilai default jika terjadi error agar tidak crash
        setStats({ beritaBaru: 0, pegawaiTerdaftar: 0, dokumenTersedia: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <section aria-labelledby="quick-stats-title">
        <h2 id="quick-stats-title" className="sr-only">
          Statistik Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </section>
    );
  }

  const statsData = [
    {
      icon: <Newspaper className="w-6 h-6 text-brand-primary" />,
      value: stats?.beritaBaru.toLocaleString("id-ID") || "0",
      label: "Berita Baru",
    },
    {
      icon: <Users className="w-6 h-6 text-brand-primary" />,
      value: stats?.pegawaiTerdaftar.toLocaleString("id-ID") || "0",
      label: "Pegawai Terdaftar",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-brand-primary" />,
      value: stats?.dokumenTersedia.toLocaleString("id-ID") || "0",
      label: "Dokumen Tersedia",
    },
  ];

  return (
    <section aria-labelledby="quick-stats-title">
      <h2 id="quick-stats-title" className="sr-only">
        Statistik Cepat
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-surface-card border border-ui-border/50 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
          >
            <div className="bg-brand-primary/10 p-4 rounded-lg">
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className="text-md text-text-secondary">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickStats;
