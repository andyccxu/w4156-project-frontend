import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import EmployeesPage from "./pages/EmployeesPage";

const App = () => {
  const [username, setUsername] = useState("Login");

  const handleLogin = (username) => {
    setUsername(username);
  };

  return (
    <div>
      {/* navigation bar with app logo */}
      <nav className="bg-gray-800">
        <div className="container mx-auto p-2 flex justify-between items-center">
          {/* logo directs us to the home page */}
          <Link to="/">
            <h2 className="text-white text-2xl font-bold">Our App logo</h2>
          </Link>
          {/* aligned to the right in the nav bar */}
          <div className="flex justify-between space-x-5">
            <Link to="/create">
              <div className="text-white">Create Schedule</div>
            </Link>
            <Link to="/employees" className="text-white"> 
              Employees
            </Link>
            <Link to="/login" className="text-white">
              {username}
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="/create" element={<CreatePage />}></Route>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />}></Route>
        <Route path="/employees" element={<EmployeesPage />}></Route> 

      </Routes>
    </div>
  );
};

export default App;
