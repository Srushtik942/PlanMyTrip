import { useState } from "react";
import axios from "axios";
import Travel from "./Assets/travel.jpg";

function App() {

  const [country, setCountry] = useState("");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = [
    "India",
    "Japan",
    "France",
    "Italy",
    "Thailand"
  ];

  const fetchTrip = async () => {
    if (!country) return;

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/travel-plan",
        { params: { country } }
      );

      setTrip(response.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100">


      {/* Hero Banner */}
      <div className="relative w-full h-screen">

        <img src={Travel} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">

          <h1 className="text-3xl font-bold">
            Welcome, Let's Plan your Itinerary!
          </h1>

          <p className="text-lg">
            See your itinerary
          </p>

          <div className="flex gap-3 bg-white/90 p-3 rounded shadow text-black">

            <select
              className="border p-2 rounded w-52"
              value={country}
              onChange={(e)=>setCountry(e.target.value)}
            >
              <option value="">Select Country</option>

              {countries.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={fetchTrip}
              disabled={!country || loading}
              className={`px-4 rounded text-white
                ${!country || loading
                  ? "bg-gray-400"
                  : "bg-blue-500"}
              `}
            >
              {loading ? "Generating..." : "Generate"}
            </button>

          </div>
        </div>
      </div>

      {/* Trip Display */}
      {trip && (
<div className="max-w-4xl mx-auto mt-6 bg-white/80 backdrop-blur-lg shadow-xl rounded-xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            Destination: {trip.destination}
          </h2>

          <p><b>Best Time:</b> {trip.best_time}</p>
          <p><b>Duration:</b> {trip.duration_days} days</p>

          {/* Attractions */}
          <div>
            <h3 className="font-semibold mb-2">Top Attractions</h3>

            <div className="grid grid-cols-2 gap-3">
              {trip.top_attractions?.map((a,i)=>(
                <div key={i} className="border rounded p-3 bg-gray-100">
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <b>Sample Itinerary</b>
            {trip.sample_itinerary?.map(day=>(
              <p key={day.day}>
                Day {day.day}: {day.plan}
              </p>
            ))}
          </div>

          <p>
            <b>Budget:</b> ₹{trip.estimated_budget?.low} —
            ₹{trip.estimated_budget?.high}
          </p>

          <div>
            <b>Tips:</b>
            {trip.local_tips?.map((t,i)=>(
              <p key={i}>• {t}</p>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export default App;
