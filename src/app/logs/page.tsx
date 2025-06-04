
'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Download, Filter, CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  id: string;
  userId: string;
  name: string;
  category: 'Student' | 'Teaching Staff' | 'Non-Teaching Staff' | 'Visitor';
  timestamp: Date;
  type: 'Entry' | 'Exit';
  gate: string;
}

const fixedBaseDateForAdditionalLogs = new Date('2023-10-28T00:00:00Z').getTime();

const mockLogs: LogEntry[] = [
  { id: '1', userId: 'S1001', name: 'Alice Smith', category: 'Student', timestamp: new Date('2023-10-26T08:00:00'), type: 'Entry', gate: 'Main Gate' },
  { id: '2', userId: 'T2002', name: 'Bob Johnson', category: 'Teaching Staff', timestamp: new Date('2023-10-26T08:05:00'), type: 'Entry', gate: 'Main Gate' },
  { id: '3', userId: 'S1001', name: 'Alice Smith', category: 'Student', timestamp: new Date('2023-10-26T12:30:00'), type: 'Exit', gate: 'Main Gate' },
  { id: '4', userId: 'N3003', name: 'Carol Williams', category: 'Non-Teaching Staff', timestamp: new Date('2023-10-26T09:00:00'), type: 'Entry', gate: 'Staff Gate' },
  { id: '5', userId: 'V4004', name: 'David Brown', category: 'Visitor', timestamp: new Date('2023-10-26T10:15:00'), type: 'Entry', gate: 'Visitor Gate' },
  { id: '6', userId: 'S1002', name: 'Eve Davis', category: 'Student', timestamp: new Date('2023-10-27T08:10:00'), type: 'Entry', gate: 'Main Gate' },
  { id: '7', userId: 'T2002', name: 'Bob Johnson', category: 'Teaching Staff', timestamp: new Date('2023-10-27T16:00:00'), type: 'Exit', gate: 'Main Gate' },
  ...Array.from({ length: 20 }, (_, i) => {
    const minutesOffset = i * 30 + (i % 5) * 7; // Deterministic offset in minutes
    return {
      id: `L${100 + i}`,
      userId: `U${2000 + i}`,
      name: `User ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(97 + (i % 26))}son${i}`,
      category: (['Student', 'Teaching Staff', 'Non-Teaching Staff', 'Visitor'] as LogEntry['category'][])[i % 4],
      timestamp: new Date(fixedBaseDateForAdditionalLogs - minutesOffset * 60 * 1000), // Deterministic timestamp
      type: (['Entry', 'Exit'] as LogEntry['type'][])[i % 2],
      gate: `Gate ${ (i % 3) + 1}`,
    };
  }),
];

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchesSearch =
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || log.category === categoryFilter;
      const matchesDate =
        !dateRange ||
        !dateRange.from ||
        (log.timestamp >= dateRange.from && (!dateRange.to || log.timestamp <= new Date(dateRange.to.getTime() + 86399999))); // Include end of day

      return matchesSearch && matchesCategory && matchesDate;
    }).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [searchTerm, categoryFilter, dateRange]);

  const handleExport = () => {
    const headers = ['User ID', 'Name', 'Category', 'Timestamp', 'Type', 'Gate'];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      filteredLogs
        .map((log) =>
          [
            log.userId,
            log.name,
            log.category,
            format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'), // Use fixed format for CSV export
            log.type,
            log.gate,
          ].join(',')
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'autoaccess_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Logs and Records</h1>
      <div className="space-y-4 rounded-lg border p-4 shadow-sm bg-card">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Student">Students</SelectItem>
              <SelectItem value="Teaching Staff">Teaching Staff</SelectItem>
              <SelectItem value="Non-Teaching Staff">Non-Teaching Staff</SelectItem>
              <SelectItem value="Visitor">Visitors</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-lg border shadow-sm bg-card">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Gate/Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.name}</TableCell>
                  <TableCell>{log.category}</TableCell>
                  <TableCell>{format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.type === 'Entry' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {log.type}
                    </span>
                  </TableCell>
                  <TableCell>{log.gate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
