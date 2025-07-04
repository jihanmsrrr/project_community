// components/ui/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Tipe data untuk setiap item di breadcrumb
export interface Crumb {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="list-none flex flex-wrap items-center gap-2 text-sm">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-2">
            {/* Tampilkan separator jika bukan item pertama */}
            {index > 0 && (
              <ChevronRight size={16} className="text-text-placeholder" />
            )}

            {/* Jika ini adalah halaman saat ini, tampilkan sebagai teks biasa */}
            {crumb.isCurrent ? (
              <span
                className="font-semibold text-text-primary"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              // Jika bukan, tampilkan sebagai link
              <Link href={crumb.href} legacyBehavior>
                <a className="font-medium text-text-secondary hover:text-brand-primary transition-colors">
                  {crumb.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
