import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import EventStepTwo from "@/components/event-admin/EventStepTwo";
import EventStepThree from "@/components/event-admin/EventStepThree";

export default function EventActionDialog({
  open,
  mode,
  data,
  onClose,
}) {
  const isDetail = mode === "detail";
  const isUpdateEvent = mode === "update-event";
  const isUpdateTicket = mode === "update-ticket";

  // 🔴 INI KUNCI UTAMA
  const [eventData, setEventData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);

  // Sync saat dialog dibuka
  useEffect(() => {
    if (open && data) {
      setEventData({ ...data });
      setTickets(
        data?.tickets?.length
          ? data.tickets
          : [
              { id: "dummy-1", name: "Ticket Dummy 1", description: "<p>Deskripsi dummy</p>", price: 10000, qty: 100, maxOrder: 1, isActive: true, status: "draft", deliverDate: "2025-01-01", startDate: "2025-01-01", startTime: "08:00", endDate: "2025-01-01", endTime: "18:00", },
              { id: "dummy-2", name: "Ticket Dummy 2", description: "<p>Deskripsi dummy</p>", price: 10000, qty: 100, maxOrder: 1, isActive: true, status: "draft", deliverDate: "2025-01-01", startDate: "2025-01-01", startTime: "08:00", endDate: "2025-01-01", endTime: "18:00", },
            ]
      );
      setActiveTicketId(
        data?.tickets?.[0]?.id || "dummy-1"
      );
    }
  }, [open, data]);

  if (!eventData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isDetail && "Detail Event"}
              {isUpdateEvent && "Update Event"}
              {isUpdateTicket && "Update Ticket"}
            </DialogTitle>

            {/* Tombol close (penting di mobile) */}
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* ================= DETAIL ================= */}
        {isDetail && (
          <div className="space-y-10">
            <EventStepTwo
              data={eventData}
              onChange={() => {}}
              readOnly
              hideAction
            />

            <EventStepThree
              tickets={ data?.tickets?.length ? data.tickets : [ 
                { id: "dummy-1", name: "Ticket Dummy 1", description: "<p>Deskripsi dummy</p>", price: 10000, qty: 100, maxOrder: 1, isActive: true, status: "draft", deliverDate: "2025-01-01", startDate: "2025-01-01", startTime: "08:00", endDate: "2025-01-01", endTime: "18:00", },
                { id: "dummy-2", name: "Ticket Dummy 2", description: "<p>Deskripsi dummy</p>", price: 10000, qty: 100, maxOrder: 1, isActive: true, status: "draft", deliverDate: "2025-01-01", startDate: "2025-01-01", startTime: "08:00", endDate: "2025-01-01", endTime: "18:00", },
              ] }
              setTickets={setTickets}
              activeTicketId={activeTicketId}
              setActiveTicketId={setActiveTicketId}
              readOnly={isDetail}
              hideAction={isDetail}
            />
          </div>
        )}

        {/* ================= UPDATE EVENT ================= */}
        {isUpdateEvent && eventData && (
          <EventStepTwo
            data={eventData}
            onChange={setEventData}
            isEdit
            onCancel={onClose}
            onNext={() => {
              console.log("FINAL UPDATE DATA:", eventData);
              onClose();
            }}
          />
        )}

        {/* ================= UPDATE TICKET ================= */}
        {isUpdateTicket && (
          <EventStepThree
              tickets={tickets}            // ⬅️ PAKAI STATE
              setTickets={setTickets}
              activeTicketId={activeTicketId}
              setActiveTicketId={setActiveTicketId}
              onFinish={() => {
                console.log("FINAL TICKETS:", tickets);
                onClose();
              }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
