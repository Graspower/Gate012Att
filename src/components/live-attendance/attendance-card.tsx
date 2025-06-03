
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface AttendanceCardProps {
  imageUrl: string;
  name: string;
  adm: string; // Admission number or ID
  timestamp: string;
  imageHint?: string;
}

export function AttendanceCard({ imageUrl, name, adm, timestamp, imageHint = "person portrait" }: AttendanceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg w-full">
      <CardContent className="flex items-center gap-3 p-3">
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          width={50} // Slightly smaller image for more cards
          height={50}
          className="rounded-md object-cover aspect-square"
          data-ai-hint={imageHint}
        />
        <div className="flex-grow overflow-hidden">
          <p className="font-semibold text-sm truncate" title={name}>{name}</p>
          <p className="text-xs text-muted-foreground truncate" title={adm}>ID: {adm}</p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
}

