// src/components/guests/GuestStats.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsProps {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  totalAttendees: number;
  totalIncludingMembers: number;
}

// Ultra compact card component with minimal padding
const CompactCard = ({ 
  value, 
  label, 
  color = "text-foreground",
  className = ""
}: { 
  value: number; 
  label: string; 
  color?: string;
  className?: string;
}) => (
  <Card className={`transition-all hover:shadow-sm ${className}`}>
    <CardContent className="px-2 py-2">
      <p className="text-[10px] text-muted-foreground text-center mb-0.5 leading-tight">{label}</p>
      <div className={`text-base font-bold text-center ${color} leading-none`}>{value}</div>
    </CardContent>
  </Card>
);

export function GuestStats({ stats }: { stats: StatsProps }) {
  return (
    <div className="w-full mb-4">
      {/* Mobile: 3 columns, Tablet: 4 columns, Desktop: 6 columns */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 max-w-full">
        <CompactCard 
          value={stats.total} 
          label="Primary"
          className="bg-card/60 m-2"
        />
        <CompactCard 
          value={stats.totalIncludingMembers} 
          label="Total + Members"
          className="bg-card/60 m-2"
        />
        <CompactCard 
          value={stats.totalAttendees} 
          label="Attendees"
          color="text-emerald-400"
          className="bg-emerald-950/30 border-emerald-500/40"
        />
        <CompactCard 
          value={stats.confirmed} 
          label="Confirmed" 
          color="text-blue-400"
          className="bg-card/60 m-2"
        />
        <CompactCard 
          value={stats.pending} 
          label="Pending" 
          color="text-yellow-400"
          className="bg-card/60 m-2"
        />
        <CompactCard 
          value={stats.declined} 
          label="Declined" 
          color="text-red-400"
          className="bg-card/60 m-2"
        />
      </div>
    </div>
  );
}
