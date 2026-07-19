import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute> <Login /> </PublicRoute>}/>
      <Route path="/register" element={<PublicRoute> <Register /> </PublicRoute> }/>
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
    </Routes>
  );
}

export default App;