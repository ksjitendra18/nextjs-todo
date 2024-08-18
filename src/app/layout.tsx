import Navbar from "@/components/navbar";
import { getCurrentUser } from "@/utils/get-current-user";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App",
  description: "Todo App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const userIsAuthenticated = !!currentUser;
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar userIsAuthenticated={userIsAuthenticated} />
        <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
