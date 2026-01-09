'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeProvider } from '@/context/theme';
import { getUserInfoFromToken, clearUserInfo } from '@/services/user-service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get user info from JWT token
    const userInfo = getUserInfoFromToken();
    if (userInfo) {
      setUser({
        name: userInfo.name,
        email: userInfo.email
      });
    } else {
      // Redirect to sign in if no user info found
      window.location.href = '/signin';
    }
  }, []);

  const handleSignOut = () => {
    // Clear stored user info
    clearUserInfo();
    // Remove auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    // Redirect to sign in page
    window.location.href = '/signin';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header user={user} onSignOut={handleSignOut} />
        <div className="flex">
          <Sidebar user={user} onSignOut={handleSignOut} />
          <main className="flex-1 md:ml-64 pt-4 pb-12">
            <div className="container">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}