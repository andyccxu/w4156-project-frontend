import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";

const App = () => {
  // get the username from the local storage
  // if the name does not exist, set it to "Login"
  var storedUserName = JSON.parse(localStorage.getItem("username"));
  if (storedUserName === null) {
    storedUserName = "Login";
  }
  // state variable: username
  // state variable can be updated by the setter function only
  const [username, setUsername] = useState(storedUserName);

  const handleLogin = (username) => {
    // redirect user to the home page
    // window.location.href = "/";
    setUsername(username);
    window.location.href = "/";
  };

  useEffect(() => {
    // side effect when state variable username updates
    // we put the username in the local storage
    localStorage.setItem("username", JSON.stringify(username));
  }, [username]);

  return (
    <div>
      {/* navigation bar with app logo */}
      <nav className="bg-gray-800">
        <div className="container mx-auto p-2 flex justify-between items-center">
          {/* logo directs us to the home page */}
          <Link to="/">
            <h2 className="text-white text-2xl font-bold">Our App logo</h2>
          </Link>
          {/* alligned to the right in the nav bar */}
          <div className="flex justify-between space-x-5">
            <Link to="/create">
              <div className="text-white">Create Schedule</div>
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
        {/* <Route path="/login" element={<LoginPage />}></Route> */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
