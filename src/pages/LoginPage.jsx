import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign-up states
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [name, setName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const SuccessMessageModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Success!</h2>
        <p>Sign up successful! Please log in.</p>
        <button
          onClick={() => setShowSuccessMessage(false)}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
  //signup submit
  const handleSignUpSubmit = async (event) => {
    event.preventDefault();

    const signUpRequestBody = {
      name,
      email: signUpEmail,
      password: signUpPassword,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/signup",
        signUpRequestBody,
        { headers: { "Content-Type": "application/json" } },
      );

      // Handle the response from the sign-up request
      console.log("Signup successful:", response.data);

      setShowSuccessMessage(true);

      setName("");
      setSignUpEmail("");
      setSignUpPassword("");
    } catch (error) {
      alert("Error during sign up:", error.response?.data || error.message);
    }
  };

  //login submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        requestBody,
      );
      const token = response.data.token;

      // Store the token in local storage
      localStorage.setItem("jwtToken", token);

      // Set the authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // call onLogin prop with the user email
      props.onLogin(requestBody.email);
    } catch (error) {
      alert(error);
      alert("Incorrect username or password");
    }
  };

  // Props Validation
  LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  return (
    <div>
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          {/* signup form */}
          {showSuccessMessage && <SuccessMessageModal />}

          <div className="mb-8">
            <form
              onSubmit={handleSignUpSubmit}
              className="flex flex-col space-y-4 items-center"
            >
              <div>
                <label className="flex flex-col w-64">
                  Name
                  <input
                    type="text"
                    value={name}
                    className="border-2 border-black mt-2 p-1"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col w-64">
                  Email
                  <input
                    type="email"
                    value={signUpEmail}
                    className="border-2 border-black mt-2 p-1"
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="flex flex-col w-64">
                  Password
                  <input
                    type="password"
                    value={signUpPassword}
                    className="border-2 border-black mt-2 p-1"
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
        rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="my-4 w-64 text-center">
            <hr className="border-t border-gray-300" />
            <span className="bg-white px-2 text-sm text-gray-500">OR</span>
          </div>

          {/* login form */}
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
    </div>
  );
};

export default LoginPage;
