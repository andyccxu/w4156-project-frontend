import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';


// Reusable EmployeeInput component
const EmployeeInput = ({ label, value, onChange, type }) => (
  <p>
    <strong>{label}: </strong>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="border-blue-500 border-2 rounded p-1"
      style={{ minWidth: '250px' }}
    />
  </p>
);

EmployeeInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
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
            <button onClick={onConfirm} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Yes
            </button>
            <button onClick={onCancel} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
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
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    skillLevel: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true); // Set loading to true before the request
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No authorization token found");
        }

        const response = await axios.get('http://localhost:8080/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setEmployees(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching employees:", err.message);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    };

    fetchEmployees();
  }, []);

  const handleEditClick = (employee) => {
    setEditEmployeeId(employee._id);
    setEditedEmployee({ ...employee });
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      // Send a DELETE request to delete the employee
      await axios.delete(`http://localhost:8080/employees/${employeeToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the employees list by filtering out the deleted employee
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp._id !== employeeToDelete._id));

      // Close the modal
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error deleting employee:", err.message);
    }
  };

  const handleCancelDelete = () => {
    // Close the modal without deleting the employee
    setIsModalVisible(false);
  };



  const handleInputChange = (e, field) => {
    setEditedEmployee({ ...editedEmployee, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.patch(`http://localhost:8080/employees/${editEmployeeId}`, editedEmployee, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEmployees(employees.map(emp => emp._id === editEmployeeId ? { ...emp, ...editedEmployee } : emp));
      setEditEmployeeId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating employee:", err.message);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleNewEmployeeChange = (e, field) => {
    setNewEmployee({ ...newEmployee, [field]: e.target.value });
  };

  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post('http://localhost:8080/employees', newEmployee, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEmployees([...employees, response.data]);
      setIsAdding(false);
      setNewEmployee({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        skillLevel: '',
        employeeOf: '',
        manager: ''
      });
    } catch (err) {
      // setError(err.message);
      console.error("Error adding new employee:", err.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 max-w-screen-lg">
        {/* ... Loading and error handling */}
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        <div>
          <Modal
            isVisible={isModalVisible}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />

          {employees.map((employee) => (
            <div key={employee._id} className="border p-4 m-4 relative rounded shadow">
              {editEmployeeId === employee._id ? (
                // Edit mode with labeled fields
                <div>
                  <EmployeeInput label="Name" value={editedEmployee.name} onChange={(e) => handleInputChange(e, 'name')} type="text" />
                  <EmployeeInput label="Email" value={editedEmployee.email} onChange={(e) => handleInputChange(e, 'email')} type="email" />
                  <EmployeeInput label="Phone Number" value={editedEmployee.phoneNumber} onChange={(e) => handleInputChange(e, 'phoneNumber')} type="tel" />
                  <EmployeeInput label="Address" value={editedEmployee.address} onChange={(e) => handleInputChange(e, 'address')} type="text" />
                  <EmployeeInput label="Skill Level" value={editedEmployee.skillLevel} onChange={(e) => handleInputChange(e, 'skillLevel')} type="number" />
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-700">
                    Save
                  </button>
                </div>
              ) : (
                // Display mode
                <div>
                  <p><strong>Name:</strong> {employee.name}</p>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                  <p><strong>Address:</strong> {employee.address}</p>
                  <p><strong>Skill Level:</strong> {employee.skillLevel}</p>
                </div>
              )}
              <svg onClick={() => handleEditClick(employee)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor"
                className="w-7 h-7 absolute top-2 right-2 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <svg onClick={() => handleDeleteClick(employee)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor"
                className="w-7 h-7 absolute bottom-2 right-2 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>

            </div>
          ))}

          {isAdding && (
            <div className="border p-4 m-4 relative rounded shadow">
              <div>
                <EmployeeInput label="Name" value={newEmployee.name} onChange={(e) => handleNewEmployeeChange(e, 'name')} type="text" />
                <EmployeeInput label="Email" value={newEmployee.email} onChange={(e) => handleNewEmployeeChange(e, 'email')} type="email" />
                <EmployeeInput label="Phone Number" value={newEmployee.phoneNumber} onChange={(e) => handleNewEmployeeChange(e, 'phoneNumber')} type="tel" />
                <EmployeeInput label="Address" value={newEmployee.address} onChange={(e) => handleNewEmployeeChange(e, 'address')} type="text" />
                <EmployeeInput label="Skill Level" value={newEmployee.skillLevel} onChange={(e) => handleNewEmployeeChange(e, 'skillLevel')} type="number" />
                <button onClick={handleAddSave} className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-700">
                  Save
                </button>
              </div>
              <svg
                onClick={() => setIsAdding(false)} // Add this line to handle the close button click
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute top-2 right-2 cursor-pointer"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

            </div>
          )}

        </div>
        <div className="flex justify-center p-4">
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-700">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
