import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Eye } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getEvents } from '@/services/superadminApi';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchEvents();
  }, [page, search, statusFilter]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await getEvents(page, pageSize, search, statusFilter);
      setEvents(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'name', label: 'Event Name' },
    { key: 'organizerName', label: 'Organizer' },
    {
      key: 'startDate',
      label: 'Date',
      render: (row) => format(new Date(row.startDate), 'MMM dd, yyyy'),
    },
    { key: 'venue', label: 'Venue' },
    {
      key: 'soldTickets',
      label: 'Tickets Sold',
      render: (row) => `${row.soldTickets}/${row.totalTickets}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedEvent(row);
            setDetailOpen(true);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage all events on your platform"
      />

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable columns={columns} data={events} loading={false} />
      )}

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.name}</DialogTitle>
              <DialogDescription>Event Details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organizer</label>
                <p className="text-sm text-muted-foreground">{selectedEvent.organizerName}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedEvent.startDate), 'PPP p')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedEvent.endDate), 'PPP p')}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Venue</label>
                <p className="text-sm text-muted-foreground">{selectedEvent.venue}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium">Tickets Sold</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.soldTickets}/{selectedEvent.totalTickets}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedEvent.status} />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
