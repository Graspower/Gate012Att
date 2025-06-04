
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserPlus,
  History,
  ScanFace,
  SettingsIcon,
  Building,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/enroll', icon: UserPlus, label: 'User Enrollment' },
  { href: '/logs', icon: History, label: 'Logs & Records' },
  { href: '/live-attendance', icon: ScanFace, label: 'Live Attendance' },
  { href: '/settings', icon: SettingsIcon, label: 'Settings' },
];

function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Building className="h-8 w-8 text-sidebar-primary" />
          <h1
            className={cn(
              "text-xl font-semibold text-sidebar-foreground transition-opacity duration-300",
              open || isMobile ? "opacity-100" : "opacity-0"
            )}
          >
            AutoAccess
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                  aria-label={item.label}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(open || isMobile ? "inline" : "hidden xl:inline")}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {open || isMobile ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          <span className={cn(open || isMobile ? "inline" : "hidden")}>Collapse</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentDateHeader, setCurrentDateHeader] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentDateHeader(format(new Date(), 'EEE, d, MMM').toUpperCase());
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-header-border bg-header px-6">
            {/* Left section: mobile trigger */}
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden" />
            </div>

            {/* Right section: Date card and placeholder for user profile/actions */}
            <div className="flex items-center">
              {currentDateHeader && (
                <div className="bg-white text-slate-900 p-2 px-3 rounded-lg shadow-md">
                  <div className="text-xl font-bold tracking-tight">
                    {currentDateHeader}
                  </div>
                </div>
              )}
              {/* User profile / actions can go here in the future, e.g., <UserButton /> */}
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
