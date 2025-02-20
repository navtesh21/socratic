"use client"
import React, { useEffect, useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  const { resolvedTheme } = useTheme();
  
const [mounted, setMounted] = useState(false); 

useEffect(() => {
  setMounted(true); // Ensure we only render after hydration
}, []);


  return (
    <>
      {/* Overlay Effect */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMenuOpen(false)} // Close menu when clicking outside
        />
      )}

      <nav className="fixed w-full z-20 top-0 start-0 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-screen-xl mx-auto p-4 relative z-20">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <a href="/" className="flex items-center space-x-3">
            {mounted && (
              <img 
                src={resolvedTheme === "dark" ? "/images/logo_dark.png" : "/images/logo.png"}
                className="h-16 w-auto" 
                alt="Socratic Logo" 
              />
            )}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>

              {/* Theme Toggle */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <ModeToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg 
                className="w-6 h-6 text-gray-700 dark:text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg w-full relative z-30">
              
              {/* Top Row: UserButton (Left) & ModeToggle (Right) */}
              <div className="flex items-center justify-between px-2 pb-3 border-b border-gray-700">
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <div className="border border-gray-600 rounded-lg p-1 bg-gray-800 dark:bg-gray-700">
                  <ModeToggle />
                </div>
              </div>

              {/* Navigation Links Below */}
              <ul className="flex flex-col space-y-2 mt-3">
                
                {/* Dashboard Link */}
                <li>
                  <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
                    <span className="text-sm font-medium">Dashboard</span>
                  </a>
                </li>

                {/* Create Contest Link */}
                <li>
                  <a href="/create-contest" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
                    <span className="text-sm font-medium">Create Contest</span>
                  </a>
                </li>

              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
