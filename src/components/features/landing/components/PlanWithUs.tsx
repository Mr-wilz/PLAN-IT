import { Phone, Gift, Star, Calendar } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

export default function PlanWithUs() {
  return (
    <section
      className="py-16 backdrop-blur-3xl  bg-white border-t border-gray-200"
      id="explore"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Why plan with Plan-It?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-center">
          <div>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-pink-100 mb-4">
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

        <div className="max-w-3xl mx-auto bg-purple-50/90 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-center mb-4">
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
