import { Phone, Gift, Star, Calendar } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

export default function PlanWithUs() {
  return (
    <section
      className="w-full border-t border-gray-200 bg-white py-12 sm:py-16 backdrop-blur-3xl"
      id="explore"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
          Why plan with Plan-It?
        </h2>

        <div className="mb-10 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
              <Phone className="text-pink-600" />
            </div>
            <h3 className="font-semibold">24/7 customer support</h3>
            <p className="text-sm text-gray-600 mt-2">
              No matter the time zone, we’re here to help.
            </p>
          </div>

          <div>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-teal-100 mb-4">
              <Gift className="text-teal-600" />
            </div>
            <h3 className="font-semibold">Earn rewards</h3>
            <p className="text-sm text-gray-600 mt-2">
              Explore, earn, redeem, and repeat with our loyalty program.
            </p>
          </div>

          <div>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-yellow-100 mb-4">
              <Star className="text-yellow-600" />
            </div>
            <h3 className="font-semibold">Millions of reviews</h3>
            <p className="text-sm text-gray-600 mt-2">
              Plan and book with confidence using reviews from fellow travelers.
            </p>
          </div>

          <div>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-sky-100 mb-4">
              <Calendar className="text-sky-600" />
            </div>
            <h3 className="font-semibold">Plan your way</h3>
            <p className="text-sm text-gray-600 mt-2">
              Stay flexible with free cancellation and reserve now, pay later
              options.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl rounded-xl bg-purple-50/90 p-5 sm:p-8">
          <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl">
            Log in to manage bookings & Plan-It Rewards
          </h3>
          <p className="text-center text-sm text-gray-600 mb-6">
            Don't have an account yet?{" "}
            <a href="/register" className="underline font-semibold">
              Sign up
            </a>
          </p>
          <div className="flex justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-500 text-white rounded-lg shadow-md"
            >
              Log In
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
