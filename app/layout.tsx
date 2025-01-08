import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS",
  description: "Plataforma LMS",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (

        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>

  );
}