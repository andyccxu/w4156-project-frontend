import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        requestBody
      );
      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem("jwtToken", token);

      // Set the authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call onLogin prop with the user email
      props.onLogin(requestBody.email);
    } catch (error) {
      console.error(error);
    }
  };

  // Props Validation
  LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  return (
    // check if the user is logged in
    // if yes, redirect to the home page
    // if not, show the login form
    <div>
      {localStorage.getItem("username") === "Login" ? (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-4 items-center"
            >
              <label className="flex flex-col w-64">
                Email
                <input
                  type="email"
                  value={email}
                  className="border-2 border-black mt-2 p-1"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col w-64">
                Password
                <input
                  type="password"
                  value={password}
                  className="border-2 border-black mt-2 p-1"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
          rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </>
      ) : (
        <>log out?</>
      )}
    </div>
  );
};

export default LoginPage;
