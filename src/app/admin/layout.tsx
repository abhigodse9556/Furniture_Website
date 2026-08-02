import type { Metadata } from "next";

import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthProvider>
      <div className="min-h-full bg-[var(--surface)] text-[var(--ink)]">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
