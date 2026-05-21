type ItineraryDocumentProps = {
  title?: string;
  summary?: string;
  destination?: string;
  budget?: string;
  planningDate?: string;
  startDate?: string;
  endDate?: string;
  duration?: string | number;
  hotels?: Array<{
    name: string;
    type: string;
    priceRange: string;
    reason: string;
  }>;
  days?: Array<{
    day: number;
    title: string;
    tips?: string;
    activities?: string[];
    meals?: string[];
  }>;
  className?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function ItineraryDocument({
  title,
  summary,
  destination,
  budget,
  planningDate,
  startDate,
  endDate,
  duration,
  hotels = [],
  days = [],
  className = "",
}: ItineraryDocumentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="rounded-[28px] border border-primary-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700">
              Itinerary Document
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-primary-500">
              {title || destination || "Trip Itinerary"}
            </h2>
            <p className="mt-2 max-w-3xl text-gray-600">
              {summary ||
                "A polished trip plan with travel dates, lodging, and a day-by-day outline."}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-gray-700 shadow-sm">
            <div className="font-semibold text-gray-900">
              {destination || "Destination"}
            </div>
            {budget ? (
              <div className="mt-1 capitalize">Budget: {budget}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-primary-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary-500">
              Planned On
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDate(planningDate)}
            </p>
          </div>
          <div className="rounded-2xl bg-primary-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary-500">
              Start Date
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDate(startDate)}
            </p>
          </div>
          <div className="rounded-2xl bg-primary-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary-500">
              End Date
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {formatDate(endDate)}
            </p>
          </div>
          <div className="rounded-2xl bg-primary-50 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary-500">
              Duration
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {duration
                ? `${duration} day${Number(duration) === 1 ? "" : "s"}`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {hotels.length > 0 && (
        <section className="rounded-[28px] border border-primary-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-semibold text-primary-500">
            Hotel and Lodge Suggestions
          </h3>
          <div className="mt-4 space-y-3">
            {hotels.slice(0, 3).map((hotel, index) => (
              <article
                key={`${hotel.name}-${index}`}
                className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {hotel.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {hotel.type} • {hotel.priceRange}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary-500 shadow-sm">
                    Budget matched
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{hotel.reason}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {days.length > 0 && (
        <section className="rounded-[28px] border border-primary-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-semibold text-primary-500">Daily Plan</h3>
          <div className="mt-4 space-y-4">
            {days.map((day, index) => (
              <article
                key={`${day.day}-${index}`}
                className="rounded-2xl border-l-4 border-primary-500 bg-primary-50/50 p-4"
              >
                <h4 className="text-lg font-semibold text-gray-900">
                  Day {day.day}: {day.title}
                </h4>
                {day.activities?.length ? (
                  <p className="mt-2 text-sm text-gray-600">
                    Activities: {day.activities.join(" · ")}
                  </p>
                ) : null}
                {day.meals?.length ? (
                  <p className="mt-1 text-sm text-gray-600">
                    Meals: {day.meals.join(" · ")}
                  </p>
                ) : null}
                {day.tips ? (
                  <p className="mt-2 text-sm text-gray-700">{day.tips}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
