import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface AttendanceCardProps {
  imageUrl: string;
  name: string;
  timestamp: string;
  imageHint?: string;
}

export function AttendanceCard({ imageUrl, name, timestamp, imageHint = "person portrait" }: AttendanceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="flex items-center gap-4 p-3">
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          width={60}
          height={60}
          className="rounded-md object-cover"
          data-ai-hint={imageHint}
        />
        <div className="flex-grow">
          <p className="font-semibold text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
}
