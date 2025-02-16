"use client"
import React, { useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-20 top-0 start-0 bg-transparent backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <a href="/" className="flex items-center space-x-3">
            <img 
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" 
              className="h-8 w-auto" 
              alt="Socratic Logo" 
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Socratic
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Auth Buttons */}
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
          <div className="md:hidden mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <SignedOut>
                <SignInButton>
                  <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-1 w-fit">
                <ModeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;