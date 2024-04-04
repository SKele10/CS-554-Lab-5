import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Company from "./components/Company";
import History from "./components/History";
import Launches from "./components/Launches/Launches";
import LaunchDetails from "./components/Launches/LaunchDetails";
import Payloads from "./components/Payloads/Payloads";
import PayloadDetails from "./components/Payloads/PayloadDetails";
import Cores from "./components/Cores/Cores";
import CoreDetails from "./components/Cores/CoreDetails";
import Error from "./components/Error";
import Rockets from "./components/Rockets/Rockets";
import RocketDetails from "./components/Rockets/RocketDetails";
import Ships from "./components/Ships/Ships";
import ShipDetails from "./components/Ships/ShipDetails";
import LaunchPads from "./components/LaunchPads/LaunchPads";
import LaunchPadDetails from "./components/LaunchPads/LaunchPadDetails";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/error" element={<Error />} />
        <Route path="/history" element={<History />} />
        <Route path="/company" element={<Company />} />
        <Route path="/launches/page/:page" element={<Launches />} />
        <Route path="/launches/:id" element={<LaunchDetails />} />
        <Route path="/payloads/page/:page" element={<Payloads />} />
        <Route path="/payloads/:id" element={<PayloadDetails />} />
        <Route path="/cores/page/:page" element={<Cores />} />
        <Route path="/cores/:id" element={<CoreDetails />} />
        <Route path="/rockets/page/:page" element={<Rockets />} />
        <Route path="/rockets/:id" element={<RocketDetails />} />
        <Route path="/ships/page/:page" element={<Ships />} />
        <Route path="/ships/:id" element={<ShipDetails />} />
        <Route path="/launchpads/page/:page" element={<LaunchPads />} />
        <Route path="/launchpads/:id" element={<LaunchPadDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
