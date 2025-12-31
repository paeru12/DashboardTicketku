import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Ellipsis,
  SquarePen,
  CalendarDays,
  TicketSlash,
  BookOpen,
  Trash,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from "react-router-dom";
import { confirmAlert, successAlert } from "@/lib/alert";
import EventActionDialog from "./EventActionDialog";


const initial = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Event ${i + 1}`,
  venue: `Venue ${((i % 3) + 1)}`,
  start: `2025-12-${(i % 28) + 1}`,
  end: `2026-01-${(i % 28) + 1}`,
  status: i % 2 === 0 ? "published" : "draft",
  totalTickets: 500 + i * 10,
  sold: Math.floor(Math.random() * 500),
}));

export default function EventList({ onAdd }) {
  const [data] = useState(initial);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return data.filter((d) =>
      [d.name, d.venue].join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const normalizeStatus = (s) => (s === "published" ? "Active" : "Inactive");

  const [dialog, setDialog] = useState({
    open: false,
    mode: null, // 'detail' | 'update-event' | 'update-ticket'
    data: null,
  });

  function openDialog(mode, row) {
    setDialog({
      open: true,
      mode,
      data: row,
    });
  }

  function closeDialog() {
    setDialog({ open: false, mode: null, data: null });
  }


  async function handleDelete(row) {
    const res = await confirmAlert({
      title: "Hapus Event?",
      text: `Event "${row.name}" akan dihapus permanen.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      icon: "error",
    });

    if (!res.isConfirmed) return;

    // TODO: panggil API delete
    // await deleteEvent(row.id);

    await successAlert(
      "Event dihapus",
      "Event berhasil dihapus."
    );
  }



  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button onClick={onAdd}>+ Add Event</Button>
      </div>

      {/* Card */}
      <div className="rounded-lg bg-white shadow-sm p-4">
        {/* Top controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="sm:w-1/2"
          />

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={6}>6 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-44 -mb-44">
          <table className="w-full text-sm divide-y">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="px-3 py-2">Nama Event</th>
                <th className="px-3 py-2">Venue</th>
                <th className="px-3 py-2">Tanggal Mulai</th>
                <th className="px-3 py-2">Tanggal Selesai</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {pageData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3">{row.name}</td>
                  <td className="px-3 py-3">{row.venue}</td>
                  <td className="px-3 py-3">{row.start}</td>
                  <td className="px-3 py-3">{row.end}</td>
                  <td className="px-3 py-3">
                    {normalizeStatus(row.status) === "Active" ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                      <div className="relative inline-block overflow-visible h-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-slate-100 rounded-full outline-none">
                              <Ellipsis size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          
                          <DropdownMenuContent 
                            align="end" 
                            className="w-48 bg-white border shadow-xl"
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              zIndex: 9999
                            }}
                          >
                            <DropdownMenuItem onClick={()=> openDialog("detail",row)} className="gap-2 p-2 cursor-pointer hover:bg-slate-50 text-left">
                              <BookOpen size={16} className="text-blue-600"/>
                              <span>Detail Event</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=> openDialog("update-event",row)} className="gap-2 p-2 cursor-pointer hover:bg-slate-50 text-left">
                              <CalendarDays size={16} className="text-amber-500"/>
                              <span>Update Event</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=> openDialog("update-ticket",row)} className="gap-2 p-2 cursor-pointer hover:bg-slate-50 text-left">
                              <TicketSlash size={16} className="text-emerald-500"/>
                              <span>Update Ticket</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={()=> handleDelete(row)} className="gap-2 p-2 cursor-pointer text-red-600 hover:bg-red-50 text-left">
                              <Trash size={16} />
                              <span>Delete Event</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>
            Showing {(page - 1) * perPage + 1} –{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.293 16.293L7.586 11.586 12.293 6.879 11.293 5.879 5.879 11.293 11.293 16.707z" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded text-sm ${page === i + 1 ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded hover:bg-slate-100 disabled:opacity-40"
            >
              <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 3.707L12.414 8.414 7.707 13.121 8.707 14.121 14.121 8.707 8.707 3.293z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
          <EventActionDialog
            open={dialog.open}
            mode={dialog.mode}
            data={dialog.data}
            onClose={closeDialog}
          />
    </div>
  );
}
