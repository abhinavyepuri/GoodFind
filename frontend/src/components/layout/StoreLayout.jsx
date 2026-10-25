import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CompareDock } from '@/components/product/CompareDock';
import { CompareModal } from '@/components/product/CompareModal';

export function StoreLayout() {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Global Comparison Dock & Matrix */}
      <CompareDock onOpenModal={() => setIsCompareOpen(true)} />
      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}

export default StoreLayout;
