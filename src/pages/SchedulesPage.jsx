/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Modal overlay */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Modal content */}
        <div className="relative z-10 bg-white p-4 rounded-md shadow-md">
          <p className="mb-4">Are you sure you want to delete schedule?</p>
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
            >
              Yes
            </button>
            <button
              onClick={onClose}
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

const NotifModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Modal overlay */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Modal content */}
        <div className="relative z-10 bg-white p-4 rounded-md shadow-md">
          <p className="mb-6 mt-4">Send notifs to employees?</p>
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
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

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [employeeIds, setEmployeeIds] = useState(new Set());


  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await axios.get("http://localhost:8080/schedules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSchedules(response.data);
        fetchEmployeeNames(response.data);
      } catch (err) {
        alert("Error fetching schedules:", err.message);
      }
    };

    fetchSchedules();
  }, []);

  //GET ONE EMPLOYEE
  const fetchEmployeeNames = async (schedules) => {
    const uniqueEmployeeIds = new Set();
    schedules.forEach((schedule) => {
      schedule.shifts.forEach((shift) => {
        uniqueEmployeeIds.add(shift.employeeId);
      });
    });

    setEmployeeIds(uniqueEmployeeIds);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authorization token found");
      }

      for (const id of uniqueEmployeeIds) {
        try {
          const response = await axios.get(
            `http://localhost:8080/employees/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setEmployeeNames((prev) => ({
            ...prev,
            [id]: response.data.employee.name,
          }));
        } catch (error) {
          // If there's an error fetching a specific employee's data, set their name to "Deleted Employee"
          setEmployeeNames((prev) => ({
            ...prev,
            [id]: "Deleted Employee",
          }));
        }
      }
    } catch (error) {
      alert("Error fetching employee data:", error.message);
    }
  };

  const handleDeleteClick = (scheduleId) => {
    setScheduleToDelete(scheduleId);
    setIsModalOpen(true);
  };

  //DELETE SCHEDULE
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      await axios.delete(
        `http://localhost:8080/schedules/${scheduleToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule._id !== scheduleToDelete)
      );

      setIsModalOpen(false);
    } catch (err) {
      alert("Error deleting schedule:", err.message);
    }
  };

  //POST SCHEDULE
  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const facilityResponse = await axios.get(
        "http://localhost:8080/facilities"
      );
      const facilityId = facilityResponse.data._id;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const scheduleResponse = await axios.post(
        "http://localhost:8080/schedules/",
        { facility: facilityId },
        { headers }
      );

      const newSchedule = scheduleResponse.data;

      // Update schedules state
      setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);

      // Check for new employee IDs in the schedule and update names if necessary
      for (const shift of newSchedule.shifts) {
        if (!employeeNames[shift.employeeId]) {
          const empResponse = await axios.get(
            `http://localhost:8080/employees/${shift.employeeId}`,
            { headers }
          );
          setEmployeeNames((prev) => ({
            ...prev,
            [shift.employeeId]: empResponse.data.employee.name,
          }));
        }
      }
    } catch (error) {
      alert("Error creating schedule:", error.message);
    }
  };

  const handleNotifClick = (schedule) => {
    setSelectedSchedule(schedule); // Set the selected schedule
    setIsNotifModalVisible(true);
  };

  const handleNotifSubmit = async (schedule) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }
  
        for (const shift of schedule.shifts) {
          try {
            const message = `Hi! Your shift details are as follows:\nShift: ${shift.start}, ${shift.end}\n, Days: ${shift.days.join(", ")}`;
            const Id = shift.employeeId;
  
            const notification = {
              employeeId: Id,
              message: message
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
          } catch (error) {
            console.error("Error sending notification for shift:", error);
          }
        
      }
  
      setIsNotifModalVisible(false);
  
    } catch (error) {
      alert("Error sending notifications: " + error.message);
    }
  };
  
  

  return (
    <div className="flex justify-center">
      <div className="w-1/2 max-w-screen-lg">
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        <NotifModal
        isVisible={isNotifModalVisible}
        onConfirm={() => handleNotifSubmit(selectedSchedule)}
        onCancel={() => setIsNotifModalVisible(false)}
      />
       
        <h1 className="flex justify-center text-2xl font-bold p-4">
          Schedules
        </h1>
        <ul>
          {schedules.map((schedule) => (
            
            <li key={schedule._id} className="mb-4">
              <div className="border p-4 rounded-lg shadow relative">
                <p>
                  <span className="font-bold">Date Generated:</span>{" "}
                  {new Date(schedule.dateGenerated).toLocaleString()}
                </p>

                {schedule.shifts.map((shift) => (
                  <div key={shift._id} className="pt-2">
                    <p>
                      <span className="font-bold">Name:</span>{" "}
                      {employeeNames[shift.employeeId]}
                    </p>
                    <p>
                      <span className="font-bold">Shift Start:</span>{" "}
                      {shift.start}
                    </p>
                    <p>
                      <span className="font-bold">Shift End:</span> {shift.end}
                    </p>
                    <p>
                      <span className="font-bold">Days:</span>{" "}
                      {shift.days.join(", ")}
                    </p>
                  </div>
                ))}

                {/* SVG Elements */}

                <svg
                  onClick={() => handleNotifClick(schedule)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-7 h-7 absolute top-2 right-2 cursor-pointer hover:fill-yellow-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                  />
                </svg>

                <svg
                  onClick={() => handleDeleteClick(schedule._id)}
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
            </li>
          ))}
        </ul>

        <div className="flex justify-center p-4">
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulesPage;
