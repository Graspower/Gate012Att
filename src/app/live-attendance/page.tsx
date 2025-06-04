
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttendanceCard } from '@/components/live-attendance/attendance-card';
import { Camera, Users, RefreshCw, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface LiveEntry {
  id: string;
  name: string;
  adm: string;
  course: string;
  imageUrl: string;
  timestamp: string; 
  imageHint: string;
}

const generateInitialEntries = (count: number): LiveEntry[] => {
  const entries: LiveEntry[] = [];
  const baseNames = ["John Doe", "Jane Smith", "Alex Green", "Maria Blue", "Sam Brown", "Carlos Ray", "Lisa Wong", "Ken Adams", "Sara Lee", "Omar Hassan", "Nina Patel", "Leo Geller"];
  const baseHints = ["man smiling", "woman glasses", "person nature", "person city", "person serious", "man sunglasses", "woman outdoor", "man indoor", "woman happy", "man thinking", "woman studio", "man casual"];
  const baseCourses = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Business Administration", "Fine Arts", "Civil Engineering", "Psychology", "Graphic Design", "Nursing", "Architecture", "Literature", "Physics"];
  const userTypes = ['S', 'T', 'N', 'V'];
  const fixedBaseTime = new Date('2023-01-01T00:00:00Z').getTime();

  for (let i = 0; i < count; i++) {
    const userType = userTypes[i % userTypes.length]; 
    const entryDate = new Date(fixedBaseTime + (count - 1 - i) * 15000); // Deterministic timestamp

    entries.push({
      id: `initial-${i + 1}`,
      name: `${baseNames[i % baseNames.length]}${i >= baseNames.length ? ' ' + (i + 1) : ''}`,
      adm: `${userType}${1000 + i}`, // Deterministic adm
      course: baseCourses[i % baseCourses.length],
      imageUrl: `https://placehold.co/200x160.png?id=initial${i}`, // Deterministic URL
      timestamp: format(entryDate, 'HH:mm:ss'), 
      imageHint: baseHints[i % baseHints.length],
    });
  }
  return entries; 
};

const initialEntriesData: LiveEntry[] = generateInitialEntries(12);

export default function LiveAttendancePage() {
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>(initialEntriesData);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [admSearch, setAdmSearch] = useState('');
  const [foundLearner, setFoundLearner] = useState<LiveEntry | null>(null);

  const [isAdmInputDialogOpen, setIsAdmInputDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);

  const getCameraPermission = async () => {
    setHasCameraPermission(null); 
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
      toast({
        title: 'Camera Access Granted',
        description: 'Live feed should be active.',
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings and retry.',
      });
    }
  };

  useEffect(() => {
    getCameraPermission();

    const interval = setInterval(() => {
      const names = ["Michael Brown", "Emily White", "David Green", "Sarah Black", "Chris Blue"];
      const hints = ["man glasses", "woman nature", "man city", "woman smiling", "man serious"];
      const courses = ["Journalism", "Marketing", "Software Dev", "Data Science", "UX Design"];
      
      const randomNameIndex = Math.floor(Math.random() * names.length);
      const userTypes = ['S', 'T', 'N', 'V'];
      const randomTypeIndex = Math.floor(Math.random() * userTypes.length);
      const randomAdmSuffix = Math.floor(1000 + Math.random() * 9000);
      
      const newEntry: LiveEntry = {
        id: Math.random().toString(36).substring(7),
        name: names[randomNameIndex],
        adm: `${userTypes[randomTypeIndex]}${randomAdmSuffix}`,
        course: courses[randomNameIndex % courses.length], 
        imageUrl: `https://placehold.co/200x160.png?id=${Math.random()}`,
        timestamp: format(new Date(), 'HH:mm:ss'), 
        imageHint: hints[randomNameIndex],
      };
      setLiveEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 12));
    }, 5000);

    return () => {
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdmSearch = () => {
    if (!admSearch.trim()) {
      toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please enter an ADM number.' });
      return;
    }
    const learner = [...initialEntriesData, ...liveEntries].find(entry => entry.adm.toLowerCase() === admSearch.toLowerCase());
    
    setIsAdmInputDialogOpen(false); 

    if (learner) {
      setFoundLearner(learner);
      setIsResultsDialogOpen(true); 
    } else {
      setFoundLearner(null);
      toast({ variant: 'default', title: 'Not Found', description: `No learner found with ADM: ${admSearch}` });
    }
    setAdmSearch(''); 
  };

  return (
    <>
      <div className="flex flex-col h-full gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Live Attendance Monitoring</h1>
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="md:col-span-1 lg:col-span-1 flex flex-col lg:max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-6 w-6" />
                Live Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="w-full space-y-2">
                <Button onClick={getCameraPermission} variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Retry Camera
                </Button>
                <Button
                  onClick={() => setIsAdmInputDialogOpen(true)}
                  variant={hasCameraPermission === false ? "destructive" : "default"}
                  className="w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {hasCameraPermission === false ? "Camera Offline: Find by ADM" : "Find by ADM"}
                </Button>
              </div>
              <div className="w-full">
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mt-4 w-full">
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                      Camera is not accessible. Try enabling permissions or retrying.
                    </AlertDescription>
                  </Alert>
                )}
                {hasCameraPermission === null && (
                  <p className="text-sm text-muted-foreground mt-2">Initializing camera...</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {liveEntries.map((entry) => (
                    <AttendanceCard
                      key={entry.id}
                      imageUrl={entry.imageUrl}
                      name={entry.name}
                      adm={entry.adm}
                      course={entry.course}
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

      <Dialog open={isAdmInputDialogOpen} onOpenChange={setIsAdmInputDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Find Learner by ADM</DialogTitle>
            <DialogDescription>
              Enter the Admission Number (ADM) to search for a learner.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adm-search" className="text-right">
                ADM No.
              </Label>
              <Input
                id="adm-search"
                value={admSearch}
                onChange={(e) => setAdmSearch(e.target.value)}
                className="col-span-3"
                placeholder="e.g., S1001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAdmInputDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAdmSearch}>Search</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Learner Details</DialogTitle>
          </DialogHeader>
          {foundLearner ? (
            <div className="space-y-3 py-4">
              <div className="relative w-full h-48 rounded-md overflow-hidden bg-muted">
                <Image src={foundLearner.imageUrl} alt={`Photo of ${foundLearner.name}`} layout="fill" objectFit="cover" data-ai-hint={foundLearner.imageHint} />
              </div>
              <h3 className="text-xl font-semibold">{foundLearner.name}</h3>
              <p className="text-sm"><span className="font-medium text-muted-foreground">ADM No:</span> {foundLearner.adm}</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Course:</span> {foundLearner.course}</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Last Seen:</span> {foundLearner.timestamp}</p>
            </div>
          ) : (
            <p className="py-4">No learner details to display.</p>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setIsResultsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    