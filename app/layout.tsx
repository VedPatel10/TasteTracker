import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link'

// components
import Navbar from './navbar'

// Clerk imports
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TasteTracker",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Navbar />
          <main className="">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}