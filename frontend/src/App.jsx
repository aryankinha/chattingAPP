import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {

  return (
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Default redirect - to chat if authenticated, login if not */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
