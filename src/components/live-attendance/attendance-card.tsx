
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface AttendanceCardProps {
  imageUrl: string;
  name: string;
  adm: string; // Admission number or ID
  course: string;
  timestamp: string;
  imageHint?: string;
}

export function AttendanceCard({ imageUrl, name, adm, course, timestamp, imageHint = "person portrait" }: AttendanceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg w-full flex flex-col rounded-lg">
      <div className="relative w-full h-40"> {/* Container for the image */}
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          layout="fill" // Use layout="fill" for responsive image that fills container
          objectFit="cover" // Ensures the image covers the area, cropping if necessary
          className="rounded-t-lg" // Round top corners if card itself isn't handling it for image
          data-ai-hint={imageHint}
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1 truncate" title={name}>{name}</h3>
        <p className="text-sm text-muted-foreground mb-0.5 truncate" title={`ADM No: ${adm}`}>ADM No: {adm}</p>
        <p className="text-sm text-muted-foreground mb-1 truncate" title={`Course: ${course}`}>Course: {course}</p>
        <p className="text-xs text-muted-foreground mt-auto pt-2">{timestamp}</p> 
      </CardContent>
    </Card>
  );
}

