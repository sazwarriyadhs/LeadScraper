'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const pathname = usePathname();
  const pageTitle =
    pathname.split('/').pop()?.replace('-', ' ') ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="lg:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold capitalize tracking-tight">
        {pageTitle}
      </h1>
    </header>
  );
}
