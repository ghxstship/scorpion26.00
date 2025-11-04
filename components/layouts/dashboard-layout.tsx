"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Home, FolderOpen, Dumbbell, Calendar, TrendingUp, 
  Plus, Trophy, Users, Flag, Star, User, CreditCard, BarChart3, 
  CheckSquare, Image, Headphones, MessageSquare, DollarSign, Shield,
  History, FileText, Settings, Plug, Mail, Menu, X, Bell, Search,
  ChevronDown, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { DemoUser } from "@/lib/auth/demo-auth";
import { UserRole, ROLE_INFO } from "@/lib/auth/rbac-types";
import { getNavigationForRole, type NavigationSection } from "@/lib/navigation/navigation-config";
import NotificationBell from "@/components/notifications/notification-bell";

// Icon mapping
const iconMap: Record<string, any> = {
  LayoutDashboard, Home, FolderOpen, Dumbbell, Calendar, TrendingUp,
  Plus, Trophy, Users, Flag, Star, User, CreditCard, BarChart3,
  CheckSquare, Image, Headphones, MessageSquare, DollarSign, Shield,
  History, FileText, Settings, Plug, Mail
};

interface DashboardLayoutProps {
  user: DemoUser;
  children: React.ReactNode;
  onLogout: () => void;
}

export default function DashboardLayout({ user, children, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const roleInfo = ROLE_INFO[user.role];
  const navigation = getNavigationForRole(user.role);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const NavContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div>
              <h2 className="font-montserrat font-bold text-lg">Scorpion26</h2>
              <p className="text-xs text-muted-foreground">{roleInfo.label} Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.section}>
            {sidebarOpen && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] || Home;
                const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground",
                      item.highlight && !isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                !sidebarOpen && "justify-center"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${user.role}/profile`}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${user.role}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:bg-card transition-all duration-300",
          sidebarOpen ? "lg:w-64" : "lg:w-20"
        )}
      >
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileSidebar}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r z-50 lg:hidden flex flex-col">
            <NavContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "lg:transition-all lg:duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Role Badge */}
            <Badge
              variant="outline"
              className={cn(
                "hidden sm:flex",
                roleInfo.color === 'red' && 'border-red-500 text-red-700 dark:text-red-400',
                roleInfo.color === 'green' && 'border-green-500 text-green-700 dark:text-green-400',
                roleInfo.color === 'blue' && 'border-blue-500 text-blue-700 dark:text-blue-400',
                roleInfo.color === 'purple' && 'border-purple-500 text-purple-700 dark:text-purple-400',
                roleInfo.color === 'gray' && 'border-gray-500 text-gray-700 dark:text-gray-400'
              )}
            >
              {roleInfo.label}
            </Badge>

            {/* Notifications */}
            <NotificationBell />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
