import { useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, ShieldCheck } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

type StoredReview = {
  id: number;
  rating: number;
  reason: string;
  created_at: string;
};

const REVIEW_STORAGE_KEY = "plan-it-footer-reviews";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

export default function ReviewWidget() {
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reason, setReason] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const savedReviews = JSON.parse(
        localStorage.getItem(REVIEW_STORAGE_KEY) || "[]",
      );

      if (Array.isArray(savedReviews)) {
        setReviews(savedReviews);
      }
    } catch {
      setReviews([]);
    }
  }, []);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!selectedRating || !trimmedReason) {
      setStatusMessage("Choose a star rating and add a short reason.");
      return;
    }

    const nextReview: StoredReview = {
      id: Date.now(),
      rating: selectedRating,
      reason: trimmedReason,
      created_at: new Date().toISOString(),
    };

    setReviews((previous) => {
      const nextReviews = [nextReview, ...previous].slice(0, 6);
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));
      return nextReviews;
    });

    setSelectedRating(0);
    setReason("");
    setStatusMessage("Thanks. Your review was added.");
  };

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Reviews
          </p>
          <h4 className="mt-2 text-lg font-semibold text-white">
            Rate your experience
          </h4>
        </div>
        <div className="rounded-full border border-amber-200/20 px-3 py-1 text-xs text-white/75">
          Feedback
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200/10 bg-[#1a140d] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/70">Overall rating</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-3xl font-bold text-amber-100">
                {averageRating ? averageRating.toFixed(1) : "0.0"}
              </span>
              <div>
                <StarRating value={averageRating} size={16} />
                <p className="mt-1 text-xs text-white/55">
                  {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
            <ShieldCheck size={14} />
            Verified by community
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-white/85">
            How would you rate us?
          </p>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <StarRating
              value={selectedRating}
              interactive
              size={24}
              className="justify-start"
              onChange={setSelectedRating}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="review-reason"
            className="mb-2 block text-sm font-medium text-white/85"
          >
            Tell us why you gave this rating
          </label>
          <div className="relative">
            <MessageSquareQuote
              className="pointer-events-none absolute left-3 top-3.5 text-white/30"
              size={18}
            />
            <textarea
              id="review-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="Example: Smooth planning flow, clear itinerary, and the map made it easy to understand the trip."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-amber-200/40"
            />
          </div>
        </div>

        {statusMessage && (
          <p className="rounded-2xl border border-amber-200/15 bg-amber-50/10 px-4 py-3 text-sm text-amber-100">
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-amber-200 px-4 py-3 text-sm font-semibold text-[#1a140d] transition hover:bg-amber-100"
        >
          Submit review
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/85">Recent reasons</p>
          <p className="text-xs text-white/45">Newest first</p>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <StarRating value={review.rating} size={14} />
                  <span className="text-xs text-white/45">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  {review.reason}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
            No reviews yet. Be the first to share what stood out.
          </p>
        )}
      </div>
    </section>
  );
}
