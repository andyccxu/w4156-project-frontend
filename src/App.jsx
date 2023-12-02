import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
// import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import UserStatus from "./components/UserStatus";
import EmployeesPage from "./pages/EmployeesPage";
import SchedulesPage from "./pages/SchedulesPage";

const App = () => {


  // get the username from the local storage
  // if the name does not exist, set it to "Login"
  var storedUserName = localStorage.getItem("username");
  if (storedUserName === null) {
    storedUserName = "Login";
  }
  // state variable: username
  // state variable can be updated by the setter function only
  const [username, setUsername] = useState(storedUserName);
  // is the user logged in/authenticated?
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("auth")) || false
  );

  const handleLogin = (username) => {
    // redirect user to the home page
    // window.location.href = "/";
    setUsername(username);
    setIsAuthenticated(true);
    window.location.href = "/home"; // Redirect to home page
  };

  useEffect(() => {
    // side effect when state variable username updates
    // we put the username in the local storage
    localStorage.setItem("username", username);

    if (username === "Login") {
      localStorage.setItem("auth", false);
    } else {
      localStorage.setItem("auth", true);
    }
  }, [username]);

  return (
    <div>
      {/* navigation bar with app logo */}
      <nav className="bg-gray-800">
        <div className="container mx-auto p-2 flex justify-between">
          {/* logo directs us to the home page */}
          <Link to="/">
            <h2 className="text-white text-2xl font-bold">Optistaff</h2>
          </Link>
          {/* aligned to the right in the nav bar */}
          <div className="flex justify-between space-x-5">
            <div>
              {username != "Login" ? (
                <div className="text-white">
                  <UserStatus username={username} />
                </div>
              ) : (
                <div className="text-white">
                  <Link to="/login" className="text-white">
                    {username}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* routes */}
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/" replace />
          }
        />
        {/* <Route
          path="/create"
          element={
            isAuthenticated ? <CreatePage /> : <Navigate to="/login" replace />
          }
        /> */}
        <Route
          path="/employees"
          element={
            isAuthenticated ? (
              <EmployeesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

<Route
          path="/schedules"
          element={
            isAuthenticated ? (
              <SchedulesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
};

export default App;
