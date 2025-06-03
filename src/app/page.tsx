'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpToLine, Clock, Wifi } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState('');
  const [systemStatus, setSystemStatus] = useState<{
    message: string;
    color: string;
  }>({ message: 'Operational', color: 'bg-green-500' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString()); // Initial time
    return () => clearInterval(timer);
  }, []);

  // Mock system status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const isOperational = Math.random() > 0.1;
      setSystemStatus(
        isOperational
          ? { message: 'Operational', color: 'bg-green-500' }
          : { message: 'Needs Attention', color: 'bg-yellow-500' }
      );
    }, 15000); // Change status every 15 seconds for demo
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Entries"
          value="1250"
          icon={<ArrowDownToLine className="h-5 w-5 text-muted-foreground" />}
          description="Last 24 hours"
        />
        <StatCard
          title="Total Exits"
          value="1200"
          icon={<ArrowUpToLine className="h-5 w-5 text-muted-foreground" />}
          description="Last 24 hours"
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Timestamp</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentTime || 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">Current system time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Wifi className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${systemStatus.color}`}
                aria-hidden="true"
              />
              <div className="text-xl font-bold">{systemStatus.message}</div>
            </div>
            <p className="text-xs text-muted-foreground">Real-time connectivity</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Placeholder for a chart or list of recent activities.
            </p>
             {/* Example: Use <BarChart> or <LineChart> from shadcn/ui/chart here */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
             <a href="/enroll" className="text-primary hover:underline">Enroll New User</a>
             <a href="/logs" className="text-primary hover:underline">View Full Logs</a>
             <a href="/settings" className="text-primary hover:underline">System Settings</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
