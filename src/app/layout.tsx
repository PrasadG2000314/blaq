import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FilterDrawer from "@/components/FilterDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import PanelBackdrop from "@/components/PanelBackdrop";

export const metadata: Metadata = {
  title: "D-BLAQ | Premium Streetwear E-Commerce Clone",
  description: "Premium streetwear clothing brand e-commerce storefront crafted in high quality combed cotton for street prestige.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <PanelBackdrop />
          <Header />
          <CartDrawer />
          <FilterDrawer />
          <SearchOverlay />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
