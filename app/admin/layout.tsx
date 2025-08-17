import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Header with Back Navigation */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
              <Link href="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to BEAM
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-700"></div>
            <div className="text-sm text-gray-400">
              Admin Panel
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
