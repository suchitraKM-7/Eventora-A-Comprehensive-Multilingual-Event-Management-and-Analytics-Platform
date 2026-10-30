function EventCard({ event, t, actions }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <h3
        className="mb-4 inline-block rounded border-l-4 border-indigo-600 bg-indigo-50 px-3 py-2 text-2xl font-black text-indigo-900"
        style={{ fontWeight: 900 }}
      >
        {event.eventName}
      </h3>

      {event.image && (
        <img
          src={event.image}
          alt={event.eventName}
          className="event-image event-image--organizer mb-4"
        />
      )}

      <div className="grid gap-2 text-sm text-slate-700">
        <p><strong>{t("category")}:</strong> {event.category}</p>
        <p><strong>{t("venue")}:</strong> {event.venue}</p>
        <p><strong>{t("date")}:</strong> {event.date}</p>
        <p><strong>{t("price")}:</strong> INR {event.price}</p>
        <p><strong>{t("availableSeats")}:</strong> {event.availableSeats}</p>
      </div>

      {actions && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export default EventCard;
