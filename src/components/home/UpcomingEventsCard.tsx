import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface Event {
  id: string;
  title: string;
  monthAbbr: string;
  day: number;
  time: string;
  location: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "All-Hands Q2 Review",
    monthAbbr: "JUN",
    day: 12,
    time: "3:00 PM",
    location: "Main Conference Hall",
  },
  {
    id: "2",
    title: "New Employee Orientation",
    monthAbbr: "JUN",
    day: 16,
    time: "10:00 AM",
    location: "HR Training Room",
  },
  {
    id: "3",
    title: "Security Awareness Workshop",
    monthAbbr: "JUN",
    day: 20,
    time: "2:00 PM",
    location: "Online · Zoom",
  },
];

export function UpcomingEventsCard() {
  return (
    <section aria-label="Upcoming events">
      <h2 className="text-[16px] font-bold text-on-surface mb-4 flex items-center gap-2">
        <Icon name="event" className="text-primary text-[20px]" />
        Upcoming Events
      </h2>

      <ul className="flex flex-col gap-3">
        {MOCK_EVENTS.map((event) => (
          <li key={event.id} className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-12 bg-surface-container rounded-lg flex flex-col items-center py-1.5 px-1"
              aria-label={`${event.monthAbbr} ${event.day}`}
            >
              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                {event.monthAbbr}
              </span>
              <span className="text-[22px] font-bold text-primary leading-tight">
                {event.day}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-on-surface leading-tight">
                {event.title}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                <Icon name="schedule" className="text-[13px]" />
                {event.time}
                <span className="mx-1">·</span>
                <Icon name="location_on" className="text-[13px]" />
                {event.location}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="/events"
        className="block w-full mt-4 bg-inverse-surface text-inverse-on-surface text-center py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        View All Events
      </Link>
    </section>
  );
}
