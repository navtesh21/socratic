import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/ui/Header";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import TenstackQuery from "../components/TenstackQuery";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Socratic App",
  description: "Your favourite leetcode constests app!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TenstackQuery> {/* ✅ Now inside <body>, which is valid */}
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {children}
              <footer className="w-full py-8 bg-gray-800 text-gray-200">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Left Side Text */}
      <div className="text-center md:text-left text-sm">
        <p>© {new Date().getFullYear()} | Made with ❤️ | <span className="italic text-gray-400">Connect with us for more exciting projects!</span></p>
      </div>
      
      {/* Social Media Links */}
      <div className="flex items-center gap-8">
        {/* Navtesh LinkedIn */}
        <div className="flex items-center">
          <a 
            href="https://www.linkedin.com/in/navtesh-maken-95a412286/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-gray-200 hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <span className="font-medium mr-2">Navtesh</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
        
        {/* Saransh LinkedIn */}
        <div className="flex items-center">
          <a 
            href="https://www.linkedin.com/in/saransh-saluja" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-gray-200 hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300"
          >
            <span className="font-medium mr-2">Saransh</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

              <Toaster />
            </ThemeProvider>
          </ClerkProvider>
        </TenstackQuery> {/* ✅ Correct placement */}
      </body>
    </html>
  );
}

