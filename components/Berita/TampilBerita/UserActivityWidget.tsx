// components/Berita/Utama/UserActivityWidget.tsx
"use client";

import Link from "next/link";
import type { ArtikelBerita } from "@/types/varia";
import { ChevronRight } from "lucide-react";

interface UserActivityWidgetProps {
  title: string;
  articles: ArtikelBerita[];
  className?: string;
}

const UserActivityWidget: React.FC<UserActivityWidgetProps> = ({
  title,
  articles,
  className,
}) => {
  return (
    <div className={className}>
      <h4 className="font-semibold text-md text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h4>
      {articles.length > 0 ? (
        <ul className="space-y-2">
          {articles.slice(0, 5).map(
            (
              artikel // Hanya tampilkan 5 teratas
            ) => (
              <li key={artikel.news_id}>
                <Link
                  href={`/varia-statistik/artikel/${artikel.news_id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-start group"
                >
                  <ChevronRight
                    size={18}
                    className="flex-shrink-0 mt-0.5 mr-1 text-slate-400 group-hover:text-blue-600 transition-all"
                  />
                  <span className="line-clamp-2">{artikel.judul}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          Tidak ada berita.
        </p>
      )}
    </div>
  );
};

export default UserActivityWidget;
