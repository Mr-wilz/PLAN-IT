const toKnowCards = [
  {
    step: "01",
    title: "Adjust your itinerary as needed",
    description:
      "Plan-It keeps your trip flexible. Update dates, reorder stops, and refine your itinerary in one place whenever plans change.",
    image:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=900&h=600&fit=crop",
    accent: "bg-orange-50",
  },
  {
    step: "02",
    title: "AI travel guidance",
    description:
      "Generate smart suggestions for stays, routes, and things to do based on your destination, budget, and style.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&h=500&fit=crop",
    accent: "bg-slate-50",
  },
  {
    step: "03",
    title: "Offline access",
    description:
      "Keep your plans close even without signal. View your itinerary, confirmations, and notes while on the move.",
    image:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=700&h=500&fit=crop",
    accent: "bg-gray-50",
  },
  {
    step: "04",
    title: "Everything in one space",
    description:
      "Manage destinations, maps, reservations, and reminders from a single workspace built for organized travel planning.",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=600&fit=crop",
    accent: "bg-stone-50",
  },
];

export default function ToKnow() {
  return (
    <section id="toKnow" className="w-full bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
            How it works
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl lg:text-4xl">
            Everything you need for planning your trip
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            A cleaner, more guided experience for planning, reviewing, and
            staying organized from the first idea to the final day of the trip.
          </p>
        </div>

        <div className="mt-12 space-y-6 lg:space-y-8">
          {toKnowCards.map((card) => (
            <article
              key={card.title}
              className="relative rounded-[30px] border border-black/5 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
            >
              <div className="absolute left-6 top-0 hidden h-full w-px bg-linear-to-b from-amber-200 via-amber-400/60 to-amber-200 lg:block" />

              <div className="grid min-h-80 grid-cols-1 md:grid-cols-[1.08fr_0.92fr]">
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:pl-14">
                  <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-amber-700">
                      <span>{card.step}</span>
                      <span className="h-1 w-1 rounded-full bg-amber-500" />
                      <span>TIMELINE</span>
                    </div>
                    <h3 className="max-w-2xl text-2xl font-semibold leading-tight text-slate-950 sm:text-[1.7rem]">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-prose text-sm leading-6 text-slate-600 sm:text-[15px]">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span>Premium trip-planning flow</span>
                  </div>
                </div>

                <div
                  className={`relative min-h-64 overflow-hidden rounded-b-[30px] md:min-h-full md:rounded-bl-none md:rounded-r-[30px] ${card.accent}`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
