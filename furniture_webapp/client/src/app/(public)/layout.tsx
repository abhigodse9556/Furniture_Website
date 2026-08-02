import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { fetchSite } from "@/lib/publicData";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await fetchSite();

  return (
    <>
      <Header site={site} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </>
  );
}
