import { Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { BeforeYouGo } from "./pages/BeforeYouGo";
import { AtTheAirport } from "./pages/AtTheAirport";
import { InTransit } from "./pages/InTransit";
import { Arrival } from "./pages/Arrival";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/before-you-go" element={<BeforeYouGo />} />
          <Route path="/at-the-airport" element={<AtTheAirport />} />
          <Route path="/in-transit" element={<InTransit />} />
          <Route path="/arrival" element={<Arrival />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
