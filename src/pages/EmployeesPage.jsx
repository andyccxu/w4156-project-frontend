import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';


// Reusable EmployeeInput component
const EmployeeInput = ({ label, value, onChange, type }) => (
  <p>
    <strong>{label}: </strong>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="border-blue-500 border-2 rounded p-1"
      style={{ minWidth: "250px" }}
    />
  </p>
);

EmployeeInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const NotifModal = ({ isVisible, employee, handleNotifSubmit, onClose }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Reset message when the modal becomes visible
    if (isVisible) {
      setMessage("");
    }
  }, [isVisible]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleNotifSubmit(employee, message);
  };

  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Modal overlay */}
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 bg-white p-4 rounded-md shadow-md">
          <p className="mb-4">
            <strong>Notify {employee.name}</strong>
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col space-y-4 items-center"
          >
            <div>
              <label className="flex flex-col w-64">
                Message
                <input
                  type="text"
                  placeholder="hello!"
                  value={message}
                  className="border-2 border-black mt-2 p-1 h-11"
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              className="bg-white-500 text-black px-4 py-2 rounded hover:bg-slate-400 border border-blue border-1"
            >
              Send notif
            </button>
          </form>
          {/* Close Icon */}
          <svg
            onClick={onClose}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 absolute top-3 right-3 cursor-pointer hover:text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    )
  );
};

// Defining PropTypes for NotifModal
NotifModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  employee: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }),
  handleNotifSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Modal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Modal overlay */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Modal content */}
        <div className="relative z-10 bg-white p-4 rounded-md shadow-md">
          <p className="mb-4">Are you sure you want to delete employee?</p>
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="bg-white-500 text-black px-4 py-2 rounded hover:bg-slate-400 border border-blue border-1"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    skillLevel: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [employeeToNotify, setEmployeeToNotify] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();


  //GET ALL EMPLOYEES, GET ONE EMPLOYEE, GET ALL NOTIFICATIONS,
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true); // Set loading to true before the request
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await axios.get("http://localhost:8080/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployees(response.data);
      } catch (err) {
        setError(err.message);
        alert("Error fetching employees:", err.message);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authorization token found");
        }

        // Fetch notifications
        const response = await axios.get(
          "http://localhost:8080/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const initialNotifications = response.data;
        const updatedNotifications = await Promise.all(
          initialNotifications.map(async (notification) => {
            try {
              const employeeResponse = await axios.get(
                `http://localhost:8080/employees/${notification.employeeId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              console.log(employeeResponse.data);
              return {
                ...notification,
                employeeName: employeeResponse.data.employee.name,
              };
            } catch (err) {
              console.error("Error fetching employee details:", err.message);
              // In case of an error, add a placeholder or handle as needed
              return { ...notification, employeeName: "Unknown" };
            }
          })
        );

        // Update notifications state with enriched data
        setNotifications(updatedNotifications);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching notifications:", err.message);
      }
    };

    fetchEmployees();
    fetchNotifications();
  }, []);

  const handleNotifClick = (employee) => {
    setEmployeeToNotify(employee);
    setIsNotifModalVisible(true);
  };

  //POST NOTIFICATION
  const handleNotifSubmit = async (employee, message) => {
    try {
      let employeeId = employee._id;

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const notification = {
        employeeId,
        message,
      };

      const response = await axios.post(
        "http://localhost:8080/notifications",
        notification,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Notification sent:", response.data);
      // Add the new notification to the notifications state
      const newNotification = response.data; // Assuming response contains the new notification data
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          ...newNotification,
          employeeName: employee.name, // Add employee name to the new notification
        },
      ]);

      setEmployeeToNotify(null);
      setIsNotifModalVisible(false);
    } catch (error) {
      alert("Error sending notification:", error);
    }
  };

  const handleEditClick = (employee) => {
    setEditEmployeeId(employee._id);
    setEditedEmployee({ ...employee });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsModalVisible(true);
  };

  //DELETE EMPLOYEE
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      // Send a DELETE request to delete the employee
      await axios.delete(
        `http://localhost:8080/employees/${employeeToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the employees list by filtering out the deleted employee
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== employeeToDelete._id)
      );

      // Close the modal
      setIsModalVisible(false);
    } catch (err) {
      alert("Error deleting employee:", err.message);
    }
  };

  const handleCancelDelete = () => {
    // Close the modal without deleting the employee
    setIsModalVisible(false);
  };

  const handleInputChange = (e, field) => {
    setEditedEmployee({ ...editedEmployee, [field]: e.target.value });
  };

  //UPDATE EMPLOYEE
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.patch(
        `http://localhost:8080/employees/${editEmployeeId}`,
        editedEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(
        employees.map((emp) =>
          emp._id === editEmployeeId ? { ...emp, ...editedEmployee } : emp
        )
      );
      setEditEmployeeId(null);
    } catch (err) {
      setError(err.message);
      alert("Error updating employee:", err.message);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleNewEmployeeChange = (e, field) => {
    setNewEmployee({ ...newEmployee, [field]: e.target.value });
  };

  //POST EMPLOYEE
  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(
        "http://localhost:8080/employees",
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees([...employees, response.data]);
      setIsAdding(false);
      setNewEmployee({
        name: "",
        email: "",
        phoneNumber: "",
        skillLevel: "",
        employeeOf: "",
        manager: "",
      });
    } catch (err) {
      // setError(err.message);
      alert("Error adding new employee:", err.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 max-w-screen-lg">
        {/* ... Loading and error handling */}
        {isLoading && <div>Loading...</div>}
        {/* {error && <div className="text-red-500">Error: {error}</div>} */}
        {error && <div className="text-red-500"></div>}
        <div>
          <svg
            onClick={() => {
              navigate('/home'); 
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mt-10 ml-3 cursor-pointer hover:fill-blue-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h1 className="flex justify-center text-2xl font-bold mt-4">
            Employees
          </h1>
        </div>
        <div>
          <Modal
            isVisible={isModalVisible}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
          <NotifModal
            isVisible={isNotifModalVisible}
            employee={employeeToNotify}
            handleNotifSubmit={handleNotifSubmit}
            onClose={() => setIsNotifModalVisible(false)}
          />

          {/* Check if there are any employees */}
          {employees.length === 0 && !isLoading ? (
            <div className="text-center my-4">No employees</div>
          ) : (
            employees.map((employee) => (
              <div
                key={employee._id}
                className="border p-4 m-4 relative rounded shadow"
              >
                {editEmployeeId === employee._id ? (
                  // Edit mode with labeled fields
                  <div>
                    <EmployeeInput
                      label="Name"
                      value={editedEmployee.name}
                      onChange={(e) => handleInputChange(e, "name")}
                      type="text"
                    />
                    <EmployeeInput
                      label="Email"
                      value={editedEmployee.email}
                      onChange={(e) => handleInputChange(e, "email")}
                      type="email"
                    />
                    <EmployeeInput
                      label="Phone Number"
                      value={editedEmployee.phoneNumber}
                      onChange={(e) => handleInputChange(e, "phoneNumber")}
                      type="tel"
                    />
                    <EmployeeInput
                      label="Skill Level"
                      value={editedEmployee.skillLevel}
                      onChange={(e) => handleInputChange(e, "skillLevel")}
                      type="number"
                    />
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-900"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Display mode
                  <div>
                    <p>
                      <strong>Name:</strong> {employee.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {employee.email}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {employee.phoneNumber}
                    </p>
                    <p>
                      <strong>Skill Level:</strong> {employee.skillLevel}
                    </p>
                  </div>
                )}
                <svg
                  onClick={() => handleEditClick(employee)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-7 h-7 absolute top-2 right-2 cursor-pointer hover:fill-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                <svg
                  onClick={() => handleNotifClick(employee)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-7 h-7 absolute top-12 right-2 cursor-pointer hover:fill-yellow-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                  />
                </svg>

                <svg
                  onClick={() => handleDeleteClick(employee)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 absolute bottom-2 right-2 cursor-pointer hover:fill-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            ))
          )}

          {isAdding && (
            <div className="border p-4 m-4 relative rounded shadow">
              <div>
                <EmployeeInput
                  label="Name"
                  value={newEmployee.name}
                  onChange={(e) => handleNewEmployeeChange(e, "name")}
                  type="text"
                />
                <EmployeeInput
                  label="Email"
                  value={newEmployee.email}
                  onChange={(e) => handleNewEmployeeChange(e, "email")}
                  type="email"
                />
                <EmployeeInput
                  label="Phone Number"
                  value={newEmployee.phoneNumber}
                  onChange={(e) => handleNewEmployeeChange(e, "phoneNumber")}
                  type="tel"
                />
                <EmployeeInput
                  label="Skill Level"
                  value={newEmployee.skillLevel}
                  onChange={(e) => handleNewEmployeeChange(e, "skillLevel")}
                  type="number"
                />
                <button
                  onClick={handleAddSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <svg
                onClick={() => setIsAdding(false)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex justify-center p-3">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* GET NOTIFICATIONS */}
        <div>
          <h1 className="flex justify-center text-2xl font-bold mt-10">
            Past Notifications
          </h1>
          {notifications.length === 0 ? (
            <div className="text-center my-4">No notifications</div>
          ) : (
            [...notifications].reverse().map((notification) => (
              <div
                key={notification._id}
                className="border p-4 m-4 relative rounded shadow"
              >
                <p>
                  <strong>Employee:</strong> {notification.employeeName}
                </p>
                <p>
                  <strong>Message:</strong> {notification.message}
                </p>
                <p>
                  <strong>Date:</strong> {notification.timestamp}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
