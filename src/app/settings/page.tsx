'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncStatus, setLastSyncStatus] = useState<{
    message: string;
    time: string | null;
    success: boolean;
  }>({ message: 'Not synced yet', time: null, success: true });
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage or system preference for dark mode
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({ title: "Theme Changed", description: "Dark mode enabled." });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({ title: "Theme Changed", description: "Light mode enabled." });
    }
  };

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    toast({ title: "Data Sync Started", description: "Synchronizing data with the server..." });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setSyncProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSyncing(false);
        const syncSuccess = Math.random() > 0.2; // Simulate success/failure
        if (syncSuccess) {
            setLastSyncStatus({ message: 'Sync Successful', time: new Date().toLocaleTimeString(), success: true });
            toast({ title: "Data Sync Complete", description: "Data synchronized successfully." });
        } else {
            setLastSyncStatus({ message: 'Sync Failed', time: new Date().toLocaleTimeString(), success: false });
            toast({ title: "Data Sync Failed", description: "Could not synchronize data. Please try again.", variant: "destructive" });
        }
      }
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Customization & Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>UI Customization</CardTitle>
            <CardDescription>Adjust the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="theme-mode" className="text-base">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Label>
              </div>
              <Switch
                id="theme-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme mode"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              More UI customization options (e.g., accent color, font size) can be added here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage system data and synchronization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Button onClick={handleManualSync} disabled={isSyncing} className="w-full">
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing Data...' : 'Manual Data Sync'}
              </Button>
              {isSyncing && (
                <Progress value={syncProgress} className="mt-2 h-2" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Last Sync Status:</h3>
              <div className="flex items-center gap-2 text-sm">
                {lastSyncStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <span>{lastSyncStatus.message}</span>
                {lastSyncStatus.time && (
                    <span className="text-muted-foreground">({lastSyncStatus.time})</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure automatic sync intervals or manage data backups.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
