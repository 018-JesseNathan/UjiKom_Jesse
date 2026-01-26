import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import PasienDashboard from "./Pages/pasienDashboard.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pasienDashboard" element={<PasienDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

