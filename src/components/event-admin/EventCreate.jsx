import { useState } from "react";
import EventStepOne from "./EventStepOne";
import EventStepTwo from "./EventStepTwo";
import EventStepThree from "./EventStepThree";

export default function EventCreate({ onCancel }) {
  const [step, setStep] = useState(1);

  /* ================= STATE UTAMA ================= */
  const [eventData, setEventData] = useState({
    // STEP 1 – Pengadaan
    // procurement: {
    //   name: "",
    //   vendor: "",
    //   note: "",
    // },

    // STEP 2 – Event
    event: {
      name: "",
      category: "",
      region: "",
      startDate: "",
      endDate: "",
      flyer: null,
      layout: null,
      description: "",
    },
  });

  /* ================= TICKETS ================= */
  const [tickets, setTickets] = useState([
    {
      id: Date.now().toString(),
      qty: "",
      price: "",
      maxOrder: "",
      description: "",
    },
  ]);

  const [activeTicketId, setActiveTicketId] = useState(tickets[0].id);

  /* ================= SUBMIT ================= */
  function handleFinish() {
    const payload = {
      procurement: eventData.procurement,
      event: eventData.event,
      tickets,
    };

    console.log("FINAL PAYLOAD:", payload);
    onCancel(); // balik ke EventList
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* {step === 1 && (
        <EventStepOne
          data={eventData.procurement}
          onChange={(procurement) =>
            setEventData((prev) => ({
              ...prev,
              procurement,
            }))
          }
          onNext={() => setStep(2)}
          onCancel={onCancel}
        />
      )} */}

      {step === 1 && (
        <EventStepTwo
          data={eventData.event}
          onChange={(event) =>
            setEventData((prev) => ({
              ...prev,
              event,
            }))
          }
          onNext={() => setStep(2)}
          onCancel={onCancel}
        />
      )}

      {step === 2 && (
        <EventStepThree
          tickets={tickets}
          setTickets={setTickets}
          activeTicketId={activeTicketId}
          setActiveTicketId={setActiveTicketId}
          onBackStep={() => setStep(1)}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}
