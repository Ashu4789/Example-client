import Home from "./pages/Home";
import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
import axios from "axios";

  function App() {
    const [userDetails, setUserDetails] = useState(null);
    const isUserLoggedIn = async () => {
      try {
        const response = await axios.get("http://localhost:5003/auth/is-user-logged-in", { withCredentials: true });
          setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    useEffect(() => {
      isUserLoggedIn();
    }, []);
    
    const handleLogout = () => {
      setUserDetails(null);
      axios.post("http://localhost:5003/auth/logout", {}, { withCredentials: true })
        .then(() => {
          console.log("Logged out successfully");
        })
        .catch(err => {
          console.error("Logout error:", err);
        });
    };
    
  return (
    <Routes>
      <Route path="/" element={userDetails ? (<Navigate to="/dashboard" />) : (<AppLayout userDetails={userDetails} onLogout={handleLogout}><Home /></AppLayout>)} />
      <Route path = "/login" element={userDetails ? <Navigate to="/dashboard" /> : (<AppLayout userDetails={userDetails} onLogout={handleLogout}><Login setUser={setUserDetails} /></AppLayout>)} />
      <Route path = "/dashboard" element={userDetails ? (<AppLayout userDetails={userDetails} onLogout={handleLogout}><Dashboard userDetails={userDetails} /></AppLayout>) : (<Navigate to="/login" />)} />
    </Routes>
  )
};

export default App;
