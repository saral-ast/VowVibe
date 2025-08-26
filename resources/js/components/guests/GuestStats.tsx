// src/components/guests/GuestStats.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsProps {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  totalAttendees: number;
}

export function GuestStats({ stats }: { stats: StatsProps }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-sm text-muted-foreground">Primary Guests</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalAttendees}</div>
          <p className="text-sm text-muted-foreground">Total Attendees</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          <p className="text-sm text-muted-foreground">Declined</p>
        </CardContent>
      </Card>
    </div>
  );
}