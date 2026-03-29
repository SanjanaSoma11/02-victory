import { AppHeader } from "@/components/layout/app-header";
import { getAllClients, getAppointmentsInRange } from "@/lib/data/queries";
import { CalendarAgenda } from "@/components/calendar/calendar-agenda";
import { AppointmentForm } from "@/components/calendar/appointment-form";

export default async function CalendarPage() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const [appointments, clients] = await Promise.all([
    getAppointmentsInRange(start, end),
    getAllClients(),
  ]);

  return (
    <>
      <AppHeader
        title="Calendar"
        description="Today and this week: scheduled client appointments. Reminders appear on the dashboard."
      />
      <div className="flex-1 space-y-10 px-6 py-8">
        <AppointmentForm
          clients={clients.map((c) => ({
            id: c.id,
            label: `${c.first_name} ${c.last_name}`,
          }))}
        />
        <CalendarAgenda start={start} end={end} initialAppointments={appointments} />
      </div>
    </>
  );
}
