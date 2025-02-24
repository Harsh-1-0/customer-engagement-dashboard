import Dashboard from "./Components/dashboard";
import AIInsightsPanel from "./Components/aiInsite";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/userstable" element={<AIInsightsPanel />} />
          {/* <UserActivity /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
