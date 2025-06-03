
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttendanceCard } from '@/components/live-attendance/attendance-card';
import { Camera, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface LiveEntry {
  id: string;
  name: string;
  adm: string; // Admission number or ID
  imageUrl: string;
  timestamp: string;
  imageHint: string;
}

const initialEntries: LiveEntry[] = [
  { id: '1', name: 'John Doe', adm: 'S1001', imageUrl: 'https://placehold.co/120x120.png', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), imageHint: 'man smiling' },
  { id: '2', name: 'Jane Smith', adm: 'T2005', imageUrl: 'https://placehold.co/120x120.png', timestamp: new Date(Date.now() - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), imageHint: 'woman glasses' },
];

export default function LiveAttendancePage() {
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>(initialEntries);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaDevices API not supported.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop video stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Michael Brown", "Emily White", "David Green", "Sarah Black", "Chris Blue"];
      const hints = ["man glasses", "woman nature", "man city", "woman smiling", "man serious"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      const userTypes = ['S', 'T', 'N', 'V'];
      const randomType = userTypes[Math.floor(Math.random() * userTypes.length)];
      const randomAdm = `${randomType}${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newEntry: LiveEntry = {
        id: Math.random().toString(36).substring(7),
        name: randomName,
        adm: randomAdm,
        imageUrl: `https://placehold.co/120x120.png?id=${Math.random()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        imageHint: randomHint,
      };
      setLiveEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 20)); // Keep last 20 entries
    }, 5000); 

    setLiveEntries(prev => prev.map((e, index) => ({...e, timestamp: new Date(Date.now() - (index * 5000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) })));

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Live Attendance Monitoring</h1>
      <div className="grid flex-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col"> {/* Reduced camera feed size */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Live Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center bg-muted rounded-b-lg p-4">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
            {hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature. The feed above might be black or frozen.
                </AlertDescription>
              </Alert>
            )}
             {hasCameraPermission === null && (
              <p className="text-sm text-muted-foreground mt-2">Initializing camera...</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 flex flex-col"> {/* Increased recent activity size */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4"> {/* Ensure ScrollArea can fill height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {liveEntries.map((entry) => (
                  <AttendanceCard
                    key={entry.id}
                    imageUrl={entry.imageUrl}
                    name={entry.name}
                    adm={entry.adm}
                    timestamp={entry.timestamp}
                    imageHint={entry.imageHint}
                  />
                ))}
                {liveEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 col-span-full">
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

