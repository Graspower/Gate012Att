'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttendanceCard } from '@/components/live-attendance/attendance-card';
import { Camera, Users } from 'lucide-react';

interface LiveEntry {
  id: string;
  name: string;
  imageUrl: string;
  timestamp: string;
  imageHint: string;
}

const initialEntries: LiveEntry[] = [
  { id: '1', name: 'John Doe', imageUrl: 'https://placehold.co/120x120.png', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), imageHint: 'man smiling' },
  { id: '2', name: 'Jane Smith', imageUrl: 'https://placehold.co/120x120.png', timestamp: new Date(Date.now() - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), imageHint: 'woman glasses' },
];

export default function LiveAttendancePage() {
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>(initialEntries);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Michael Brown", "Emily White", "David Green", "Sarah Black", "Chris Blue"];
      const hints = ["man glasses", "woman nature", "man city", "woman smiling", "man serious"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      
      const newEntry: LiveEntry = {
        id: Math.random().toString(36).substring(7),
        name: randomName,
        imageUrl: `https://placehold.co/120x120.png?id=${Math.random()}`, // Add random query to get different placeholders
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        imageHint: randomHint,
      };
      setLiveEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 10)); // Keep last 10 entries
    }, 5000); // Add a new entry every 5 seconds

    // Set initial timestamps correctly
    setLiveEntries(prev => prev.map(e => ({...e, timestamp: new Date(Date.now() - (prev.indexOf(e) * 5000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) })));


    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Live Attendance Monitoring</h1>
      <div className="grid flex-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Live Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-muted rounded-b-lg">
            <div className="text-center text-muted-foreground">
              <Camera className="h-24 w-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Camera Feed Placeholder</p>
              <p className="text-sm">Live video stream would appear here.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {liveEntries.map((entry) => (
                  <AttendanceCard
                    key={entry.id}
                    imageUrl={entry.imageUrl}
                    name={entry.name}
                    timestamp={entry.timestamp}
                    imageHint={entry.imageHint}
                  />
                ))}
                {liveEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No recent activity.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
