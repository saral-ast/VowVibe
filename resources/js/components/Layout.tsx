import React, { useState, useEffect } from 'react';
import { Home, Users, DollarSign, Calendar, CheckSquare, User, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'guests', label: 'Guests', icon: Users, href: '/guests' },
  { id: 'budget', label: 'Budget', icon: DollarSign, href: '/budget' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar' },
];

export default function Layout({ children }: LayoutProps) {
  // Logic from the first layout - getting auth data with proper typing
  const { props, url } = usePage<PageProps>();
  const { auth } = props;
  const { user } = auth;

  // UI state management from both layouts
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  // Mobile layout from the second UI
  if (isMobile) {
    return (
      <div className="bg-background min-h-screen">
        {/* Mobile Header */}
        <header className="bg-background border-b border-border px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">VowVibe</h1>
                <p className="text-xs text-muted-foreground">Wedding Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-8 h-8 p-0">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="p-4 pb-24 bg-background">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
          <div className="flex items-center justify-around h-16 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = url.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-16 h-16 gap-1 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop layout - UI from second, logic from first
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">VowVibe</h1>
                <p className="text-sm text-muted-foreground">Wedding Manager</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = url.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User section - combining both approaches */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-8 h-8 p-0">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {/* Logic from first layout - dynamic wedding data */}
                {user?.wedding ? (
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user.wedding.bride_name} & {user.wedding.groom_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.wedding.wedding_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    {/* Fallback if wedding data is not available */}
                    <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">Welcome</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-background">
        {children}
      </main>
    </div>
  );
}
