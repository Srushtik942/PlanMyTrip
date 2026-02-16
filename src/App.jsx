import { useState } from "react";
import axios from "axios";
import Travel from "./Assets/travel.jpg";
import { motion } from "framer-motion";
import Footer from "./components/Footer"


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


// ================= HOME PAGE =================
function Home({ trip }) {
  return (
    <div className="p-8">

      {trip && (
        <div className="grid md:grid-cols-2 gap-6 max-w-full">

          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-3 text-orange-400">
              {trip.destination}
            </h2>
            <p>📅 Best Time: {trip.best_time}</p>
            <p>⏱ Duration: {trip.duration_days} days</p>
            <p className="mt-3">
              💰 Budget: ${trip.estimated_budget?.low} -
              ${trip.estimated_budget?.high}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow">
            <h3 className="text-2xl font-bold text-orange-400  mb-3">Top Attractions</h3>

            {trip.top_attractions?.map((a, i) => (
              <div key={i} className="bg-white/30 rounded p-2 mb-2">
                {a}
              </div>
            ))}
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow md:col-span-2">
            <h3 className="text-2xl text-orange-400 font-bold mb-3">Sample Itinerary</h3>

            {trip.sample_itinerary?.map(day => (
              <div key={day.day} className="mb-2">
                <b >Day {day.day}:</b> {day.plan}
              </div>
            ))}
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow md:col-span-2">
            <h3 className="font-bold mb-3 text-2xl text-orange-400">Local Tips</h3>

            {trip.local_tips?.map((t, i) => (
              <p key={i}>• {t}</p>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}


//================= PROFILE PAGE =================

// const mockUser = {
//   name: "Srushti",
//   email: "sru@example.com",
//   travelStyle: "Adventure",
//   visitedCountries: ["France", "Japan"],
//   savedTrips: [
//     { destination: "Italy", duration_days: 7 },
//     { destination: "India", duration_days: 10 },
//   ],
// };


// function Profile({ user }) {
//   return (
//     <div className="p-8 text-white max-w-2xl mx-auto bg-white/20 rounded-2xl shadow-lg space-y-6">

//       {/* User Info */}
//       <div className="border-b border-white/30 pb-4">
//         <h2 className="text-3xl font-bold mb-2">👤 {user.name}</h2>
//         <p>Email: {user.email}</p>
//         <p>Preferred Travel Style: {user.travelStyle}</p>
//         <p>Visited Countries: {user.visitedCountries.join(", ")}</p>
//       </div>


//     </div>
//   );
// }



// ================= MAIN APP =================
export default function App() {

  const [country, setCountry] = useState("");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ taglines, setTaglines] = useState([]);


// fetch tagline
  const fetchTagLines = async()=>{
    if(!country) return;
    try{
      const response = await axios.get(
        "https://ai-explore.onrender.com/api/taglines",
        {params:{country}}
      );
      setTaglines(response.data.taglines || []);

    }catch(error){
      console.log(error);
    }
  }

// fetch trips
  const fetchTrip = async () => {
    if (!country) return;

    try {
      setLoading(true);

      const response = await axios.get(
        "https://ai-explore.onrender.com/api/travel-plan",
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
    <Router>

      <div className="relative min-h-screen text-white">

        {/* Background */}
        <img
          src={Travel}
          alt="travel background"
          className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        />
        <div className="fixed inset-0 bg-black/60 -z-10"></div>



        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/10">

          <h1 className="text-xl font-bold text-orange-400 cursor-pointer hover:text-white">PlanMyTrip</h1>

          {/* SEARCH IN NAVBAR */}
          <div className="flex gap-3 w-[420px]">
            <input
              type="text"
              placeholder="Search country..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 p-2 rounded bg-white/90 text-black"
            />

            <button
              onClick={async()=>{
                try{
                  setLoading(true);
                  await fetchTagLines();

                  await fetchTrip();
                }catch(error){
                  console.log.apply(error);
                }finally{
                   setLoading(false);
                }

              }}
              disabled={!country || loading}
              className="px-4 bg-orange-500 rounded cursor-pointer"
            >
              {loading ? "Planning..." : "Go"}
            </button>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <Link to="/" className="hover:text-orange-400">
              Home
            </Link>

            <Link to="/profile" className="hover:text-orange-400">
              Profile
            </Link>
          </div>

        </nav>

<h2 className="font-bold text-5xl text-center my-10  flex justify-center gap-3 flex-wrap">

  {["Plan", "your", "Next", "Trip", "With", "Us!"].map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.25 }}
      className={word ===  "Trip"  ? "text-orange-400" : ""}
    >
      {word}
    </motion.span>
  ))}

</h2>

 {taglines.length > 0 && (
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="
      text-lg font-semibold text-white-800
      bg-white/10

      border border-orange-400
      rounded-2xl
    py-5
    mb-10
    my-5
      shadow-lg
      max-w-xl mx-auto text-center
    "
  >
     {taglines[0]}
  </motion.p>
)}


        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home trip={trip} />} />
          {/* <Route path="/profile" element={<Profile  user={mockUser}/>} /> */}
        </Routes>


      </div>

    </Router>
  );
}
