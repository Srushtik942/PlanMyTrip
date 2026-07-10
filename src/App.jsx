import { useState } from "react";
import axios from "axios";
import Travel from "./Assets/travel.jpg";
import { motion } from "framer-motion";
import TravelPlanSkeleton from "./TravelPlanSkeleton";
import tip1  from "./Assets/Train.png";
import tip2 from "./Assets/Places.png";
import tip3 from "./Assets/Cash.png";
import tip4 from "./Assets/Rest.png";

const tipImages = [tip1, tip2, tip3, tip4];


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Itinerary from "./components/Itinerary";


//  HOME PAGE
function Home({ trip }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [travelMode, setTravelMode] = useState("flight");
  const [daysToGo, setDaysToGo] = useState(trip?.duration_days || 3);
  const [destInput, setDestInput] = useState(trip?.destination || "");
  const [estimate, setEstimate] = useState(null);

  const computeEstimate = () => {
    if (!trip) return null;
    const low = trip.estimated_budget?.low || 100;
    const high = trip.estimated_budget?.high || 300;
    const base = (low + high) / 2;
    const perDay = base / (trip.duration_days || Math.max(daysToGo, 1));
    const modeMultiplier = travelMode === "flight" ? 1.5 : 1.0;
    const total = Math.round(perDay * daysToGo * modeMultiplier);
    return total;
  };

  const handleEstimate = () => {
    const val = computeEstimate();
    setEstimate(val);
  };

  const handleBook = () => {
    if (!user) {
      navigate("/login", { state: { message: "You're not logged In. Please login to book.", from: { pathname: "/" } } });
      return;
    }

    // For authenticated users - proceed to booking flow (placeholder)
    navigate("/profile");
  };
  return (
    <div className="p-8">

      {trip && (
        <div className="grid gap-5 max-w-6xl mx-auto">

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
  <h3 className="text-2xl text-orange-400 font-bold mb-4">
    Sample Itinerary
  </h3>

  <div className="space-y-4">
    {trip.sample_itinerary?.map((day) => (
      <div
        key={day.day}
        className="
          bg-white/10 rounded-xl p-4
          border border-white/20
          hover:scale-[1.02]
          transition
        "
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-orange-400">
            Day {day.day}
          </span>

          <span className="text-xs opacity-70">
            Suggested plan
          </span>
        </div>

        <p className="leading-relaxed">
          {day.plan}
        </p>
      </div>
    ))}
  </div>
</div>


       <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow md:col-span-2">
  <h3 className="font-bold mb-4 text-2xl text-orange-400">
    Local Tips
  </h3>

  <div className="grid md:grid-cols-3 gap-4">
    {trip.local_tips?.map((t, i) => (
      <div
        key={i}
        className="relative rounded-xl overflow-hidden group shadow-lg"
      >
        <img
          src={tipImages[i % tipImages.length]}
          className="
            w-full h-44 object-cover
            group-hover:scale-110
            transition duration-300
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 flex items-end p-4">
          <p className="text-sm leading-relaxed">
            {t}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

          {!user && (
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 shadow mt-6 md:col-span-3">
              <h3 className="text-2xl font-bold text-center text-orange-400 mb-3">Book a Package?</h3>
              <p className="text-sm text-center text-slate-300">For now, click below to login and continue with booking.</p>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleBook}
                  className="px-4 py-2  bg-amber-400 rounded text-white"
                >
                  Book a Package?
                </button>
              </div>
            </div>
          )}
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



function PrivateRoute({ element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

    // const key = `trip-${country.trim().toLocaleLowerCase()}`;

    try {
      setLoading(true);

      // const cached = localStorage.getItem(key);

      // if(cached){
      //   setTrip(JSON.parse(cached));
      //   return;
      // }

      const response = await axios.get(
        "https://ai-explore.onrender.com/api/travel-plan",
        {
           params: { country } ,

      }
      );

      setTrip(response.data);
      // localStorage.setItem(key, JSON.stringify(response.data));

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  return (
        <div className="relative min-h-screen text-white">

        {/* Background */}
        <img
          src={Travel}
          alt="travel background"
          className="fixed top-0 left-0 w-full h-full object-cover -z-20"
        />
        <div className="fixed inset-0 bg-black/60 -z-10"></div>

        <nav className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-orange-400 cursor-pointer hover:text-white">PlanMyTrip</h1>
          </div>

          {user && (
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-white rounded-xl px-3 py-1 flex items-center gap-6 border">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-1 rounded-xl text-sm ${isActive ? "bg-black text-white" : "text-slate-700 hover:text-orange-400"}`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/plan-itinerary"
                  className={({ isActive }) =>
                    `px-4 py-1 rounded-xl text-sm ${isActive ? "bg-black text-white" : "text-slate-700 hover:text-orange-400"}`
                  }
                >
                  Travel Guides
                </NavLink>
                <a href="#" className="text-sm text-slate-700">Blog</a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="text-sm hover:text-orange-400">Profile</Link>
                <button
                  onClick={() => logout()}
                  className="text-sm text-slate-100 hover:text-orange-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded text-sm bg-white/90 text-black">Log In</Link>
                <Link to="/signup" className="px-4 py-2 rounded text-sm bg-orange-500 text-white">Get Started</Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/plan-itinerary' && (
        <div className="max-w-6xl mx-auto mt-10">
          <div className=" rounded-xl p-10 shadow-xl mx-4 md:mx-0">
            <div className="text-center text-white">
              <h2 className="font-bold text-5xl mb-6 flex justify-center gap-3 flex-wrap">
                {['Plan', 'your', 'Next', 'Trip', 'With', 'Us!'].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.18 }}
                    className={word === 'Trip' ? 'text-orange-400' : ''}
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>

              <div className="mt-6 flex justify-center">
                <div className="w-full md:w-3/4 lg:w-2/3">
                  <div className="flex items-center rounded-full overflow-hidden shadow-lg border border-white/20 bg-white">
                    <input
                      type="text"
                      placeholder="Mount Fuji, Japan"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex-1 px-6 py-4 outline-none text-black"
                    />
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await fetchTagLines();
                          await fetchTrip();
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={!country || loading}
                      className="bg-orange-500 text-white px-6 py-3 cursor-pointer"
                    >
                      {loading ? 'Planning...' : 'Start Planning'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

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


{/* Skeleton loader */}
{loading && !trip && <TravelPlanSkeleton text="Generating your travel plan..." />}




        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home trip={trip} />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/plan-itinerary" element={<PrivateRoute element={<Itinerary/>}/>} />
        </Routes>

        </div>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
