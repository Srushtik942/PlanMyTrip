import { useState } from "react";
import axios from "axios";

const defaultFormValues = {
  origin: "",
  destination: "",
  travellers: "",
  budgetMin: "",
  budgetMax: "",
  currency: "",
  preference: "",
  startDate: "",
  endDate: "",
  contact: "",
};

const buildItinerary = (values) => {
  const travellers = Number(values.travellers || 1);
  const budgetMin = Number(values.budgetMin || 10000);
  const budgetMax = Number(values.budgetMax || 30000);
  const startDate = values.startDate ? new Date(values.startDate) : new Date();
  const endDate = values.endDate ? new Date(values.endDate) : new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
  const durationDays = values.startDate && values.endDate
    ? Math.max(1, Math.round((endDate - startDate) / 86400000) + 1)
    : 7;
  const estimatedTotalCost = Math.round((budgetMin + budgetMax) / 2 + travellers * 1800 + durationDays * 850);

  return {
    origin: values.origin || "Your city",
    destination: values.destination || "Your destination",
    duration_days: durationDays,
    summary: `A ${durationDays}-day escape designed for ${travellers} travellers with a focus on ${values.preference || "a balanced experience"}.`,
    days: [
      {
        day: 1,
        title: `Arrival in ${values.destination || "your destination"}`,
        activities: [
          {
            time: "Afternoon",
            activity: "Check-in and settle into a relaxing stay",
            location: "Your hotel or resort",
            estimated_cost: 1200,
          },
        ],
      },
      {
        day: 2,
        title: "Scenic exploration and local highlights",
        activities: [
          {
            time: "Morning",
            activity: "Visit the best local viewpoints and landmarks",
            location: "Nearby attractions",
            estimated_cost: 1800,
          },
          {
            time: "Afternoon",
            activity: "Enjoy a leisurely lunch with local flavours",
            location: "Local cafe",
            estimated_cost: 900,
          },
          {
            time: "Evening",
            activity: "Sunset experience or cultural performance",
            location: "City centre",
            estimated_cost: 2500,
          },
        ],
      },
      {
        day: 3,
        title: "Culture and history day",
        activities: [
          {
            time: "Full Day",
            activity: "Tour museums, heritage sites, and local neighbourhoods",
            location: "Historic district",
            estimated_cost: 2200,
          },
        ],
      },
      {
        day: 4,
        title: "Nature and wellness break",
        activities: [
          {
            time: "Morning",
            activity: "Visit gardens, waterfalls, or nature trails",
            location: "Nature reserve",
            estimated_cost: 2600,
          },
          {
            time: "Afternoon",
            activity: "Relax with a spa treatment or wellness session",
            location: "Resort",
            estimated_cost: 1800,
          },
        ],
      },
      {
        day: 5,
        title: "Leisure and market experience",
        activities: [
          {
            time: "Morning",
            activity: "Browse local markets and souvenir shops",
            location: "Market area",
            estimated_cost: 1400,
          },
          {
            time: "Evening",
            activity: "Dinner at a popular local restaurant",
            location: "Dining street",
            estimated_cost: 2000,
          },
        ],
      },
      {
        day: 6,
        title: "Relaxed day with flexible plans",
        activities: [
          {
            time: "Morning",
            activity: "Slow breakfast and free time by the beach or pool",
            location: "Resort",
            estimated_cost: 1100,
          },
          {
            time: "Afternoon",
            activity: "Optional activities based on your mood",
            location: "Adventure or wellness spot",
            estimated_cost: 1500,
          },
        ],
      },
      {
        day: 7,
        title: "Departure and wrap-up",
        activities: [
          {
            time: "Morning",
            activity: "Breakfast and checkout",
            location: "Hotel",
            estimated_cost: 900,
          },
        ],
      },
    ],
    estimated_total_cost: estimatedTotalCost,
    currency: values.currency || "INR",
    local_tips: [
      "Book premium experiences early for the best availability.",
      "Keep a small cash reserve for local transport and market purchases.",
      "Check weather and local events before the trip starts.",
    ],
  };
};

const normalizeItinerary = (payload) => {
  if (!payload) return null;
  if (payload.itinerary) return normalizeItinerary(payload.itinerary);
  if (payload.plan) return normalizeItinerary(payload.plan);
  if (payload.data) return normalizeItinerary(payload.data);
  if (payload.days && Array.isArray(payload.days)) return payload;
  return null;
};

const Itinerary = () => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errors, setErrors] = useState({});
  const [itinerary, setItinerary] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const tripSearchApiUrl =  "https://ai-explore.onrender.com/api/trips/search";
  console.l

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedOrigin = formValues.origin.trim();
    const trimmedDestination = formValues.destination.trim();
    const trimmedPreference = formValues.preference.trim();
    const trimmedContact = formValues.contact.trim();

    if (!trimmedOrigin) nextErrors.origin = "Origin is required.";
    if (!trimmedDestination) nextErrors.destination = "Destination is required.";
    if (trimmedOrigin && trimmedDestination && trimmedOrigin.toLowerCase() === trimmedDestination.toLowerCase()) {
      nextErrors.destination = "Origin and destination must be different.";
    }
    if (!trimmedPreference) nextErrors.preference = "Please mention your travel preference.";

    const travellers = Number(formValues.travellers);
    if (!Number.isInteger(travellers) || travellers < 1 || travellers > 20) {
      nextErrors.travellers = "Travellers must be between 1 and 20.";
    }

    const budgetMin = Number(formValues.budgetMin);
    const budgetMax = Number(formValues.budgetMax);
    if (!Number.isFinite(budgetMin) || budgetMin <= 0) nextErrors.budgetMin = "Minimum budget must be a positive number.";
    if (!Number.isFinite(budgetMax) || budgetMax <= 0) nextErrors.budgetMax = "Maximum budget must be a positive number.";
    if (Number.isFinite(budgetMin) && Number.isFinite(budgetMax) && budgetMax < budgetMin) {
      nextErrors.budgetMax = "Maximum budget should be greater than or equal to the minimum.";
    }

    if (!formValues.startDate) nextErrors.startDate = "Start date is required.";
    if (!formValues.endDate) nextErrors.endDate = "End date is required.";
    if (formValues.startDate && formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
      nextErrors.endDate = "End date cannot be before the start date.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedContact) nextErrors.contact = "Contact email is required.";
    else if (!emailPattern.test(trimmedContact)) nextErrors.contact = "Please enter a valid email address.";

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setNotice("");

    try {
      // NEW
const destTrimmed = formValues.destination.trim();
const [destCity, ...destRest] = destTrimmed.split(",").map((s) => s.trim());
const destCountry = destRest.join(", ");

const startDate = new Date(formValues.startDate);
const endDate = new Date(formValues.endDate);
const durationDays = Math.max(1, Math.round((endDate - startDate) / 86400000) + 1);

const response = await axios.post(tripSearchApiUrl, {
  origin: formValues.origin.trim(),
  destination: {
    city: destCity || destTrimmed,
    country: destCountry || "",
  },
  travellers: {
    adults: Number(formValues.travellers),
    children: 0,
  },
  budget: {
    min: Number(formValues.budgetMin),
    max: Number(formValues.budgetMax),
    currency: formValues.currency.trim() || "INR",
  },
  preference: {
    accommodation: formValues.preference.trim(),
  },
  dates: {
    startDate: formValues.startDate,
    endDate: formValues.endDate,
    durationDays,
  },
  contact: formValues.contact.trim(),
});
console.log("response",response);
      const normalized = normalizeItinerary(response.data);
    if (!normalized) throw new Error("The API response did not contain a valid itinerary.");

      setItinerary(normalized);
      setExpandedDay(1);
      setNotice("Itinerary generated successfully.");
    } catch (error) {
      setItinerary(buildItinerary(formValues));
      setExpandedDay(1);
      setNotice(error.message || "Unable to generate itinerary right now. A local draft has been prepared instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Trip planner</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Create your custom itinerary</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
              Enter your travel details, validate them instantly, and generate a itinerary that you can explore day by day.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-400/30 bg-orange-500/20 px-4 py-3 text-sm text-orange-100">
            <span className="font-semibold">Ready to plan?</span> Fill in the form and generate a trip in seconds.
          </div>
        </div>

        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Origin</label>
            <input
              name="origin"
              value={formValues.origin}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-400"
              placeholder="e.g. Pune"
            />
            {errors.origin ? <p className="mt-1 text-sm text-rose-300">{errors.origin}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Destination</label>
            <input
              name="destination"
              value={formValues.destination}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
              placeholder="e.g. Bali, Indonesia"
            />
            {errors.destination ? <p className="mt-1 text-sm text-rose-300">{errors.destination}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Travellers</label>
            <input
              type="number"
              name="travellers"
              min="1"
              max="20"
              value={formValues.travellers}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            />
            {errors.travellers ? <p className="mt-1 text-sm text-rose-300">{errors.travellers}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Currency</label>
            <input
              name="currency"
              value={formValues.currency}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
              placeholder="e.g. INR"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Budget Min</label>
            <input
              type="number"
              name="budgetMin"
              min="1"
              value={formValues.budgetMin}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            />
            {errors.budgetMin ? <p className="mt-1 text-sm text-rose-300">{errors.budgetMin}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Budget Max</label>
            <input
              type="number"
              name="budgetMax"
              min="1"
              value={formValues.budgetMax}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            />
            {errors.budgetMax ? <p className="mt-1 text-sm text-rose-300">{errors.budgetMax}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Preference</label>
            <input
              name="preference"
              value={formValues.preference}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
              placeholder="e.g. relaxation, culture"
            />
            {errors.preference ? <p className="mt-1 text-sm text-rose-300">{errors.preference}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Contact Email</label>
            <input
              type="email"
              name="contact"
              value={formValues.contact}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-400"
              placeholder="user@example.com"
            />
            {errors.contact ? <p className="mt-1 text-sm text-rose-300">{errors.contact}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formValues.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none"
            />
            {errors.startDate ? <p className="mt-1 text-sm text-rose-300">{errors.startDate}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-100">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formValues.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 py-3 text-white outline-none"
            />
            {errors.endDate ? <p className="mt-1 text-sm text-rose-300">{errors.endDate}</p> : null}
          </div>

          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-400"
            >
              {loading ? "Generating..." : "Generate itinerary"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-white/20 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-xl">
        {notice ? (
          <div className="mb-4 rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
            {notice}
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-8 py-16 text-center text-slate-300">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
            <p className="text-lg font-semibold text-white">Generating your itinerary...</p>
            <p className="mt-2 text-sm">Please wait while we prepare your travel plan.</p>
          </div>
        ) : !itinerary ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">Your generated itinerary will appear here.</p>
            <p className="mt-2 text-sm">Fill in the form and click “Generate itinerary” to create a detailed plan.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Generated plan</p>
                <h2 className="text-2xl font-bold text-white">{itinerary.destination}</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">{itinerary.summary}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Duration</p>
                  <p className="mt-1 text-lg font-semibold text-white">{itinerary.duration_days} days</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Travelers</p>
                  <p className="mt-1 text-lg font-semibold text-white">{formValues.travellers || 1}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estimated total</p>
                  <p className="mt-1 text-lg font-semibold text-white">{itinerary.currency} {Number(itinerary.estimated_total_cost || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold text-orange-300">Origin</p>
                <p className="mt-1 text-white">{itinerary.origin}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold text-orange-300">Budget</p>
                <p className="mt-1 text-white">{itinerary.currency} {Number(formValues.budgetMin || 0).toLocaleString()} - {Number(formValues.budgetMax || 0).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold text-orange-300">Contact</p>
                <p className="mt-1 text-white">{formValues.contact}</p>
              </div>
            </div>

            <div className="space-y-4">
              {itinerary.days.map((day) => {
                const isExpanded = expandedDay === day.day;
                return (
                  <div key={day.day} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <button
                      type="button"
                      onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Day {day.day}</p>
                        <h3 className="text-xl font-semibold text-white">{day.title}</h3>
                      </div>
                      <span className="text-sm text-slate-300">{isExpanded ? "Hide details" : "Show details"}</span>
                    </button>

                    {isExpanded ? (
                      <div className="mt-4 space-y-3">
                        {day.activities.map((activity, index) => (
                          <div key={`${day.day}-${index}`} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold text-white">{activity.activity}</p>
                                <p className="text-sm text-slate-400">{activity.location}</p>
                              </div>
                              <div className="text-sm text-slate-300">
                                <span className="mr-3 rounded-full bg-orange-500/20 px-2.5 py-1 text-orange-200">{activity.time}</span>
                                <span>{itinerary.currency} {Number(activity.estimated_cost || 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
              <h3 className="text-lg font-semibold text-orange-200">Helpful tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {itinerary.local_tips.map((tip, index) => (
                  <li key={`${tip}-${index}`} className="flex gap-2">
                    <span className="text-orange-300">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
