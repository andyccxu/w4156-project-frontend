import { useEffect, useState } from "react";
import axios from "axios";
import FacilityForm from "../components/FacilityForm";
import PropTypes from "prop-types";
import { Routes, Route, Link, Navigate } from "react-router-dom";


const LabelDisplay = ({ label, value }) => (
  <>
    <p className="block text-gray-700 text-lg font-bold mb-2">{label}:</p>
    <p className="text-gray-700 text-base pb-4">{value}</p>
  </>
);
LabelDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const EditModal = ({
  isOpen,
  onClose,
  facility,
  closeModal,
  onUpdate,
  operationType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white mx-auto my-auto flex flex-col items-center justify-center">
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

        <div className="w-full">
          <FacilityForm
            facility={facility}
            closeModal={closeModal}
            onUpdate={onUpdate}
            operationType={operationType}
          />
        </div>
      </div>
    </div>
  );
};
EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  facility: PropTypes.object, // Use PropTypes.shape({...}) to define specific object structure if needed
  closeModal: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  operationType: PropTypes.string.isRequired,
};

const DeleteModal = ({ isOpen, onClose, onDeletionSuccess }) => {
  if (!isOpen) return null;

  const handleDeleteFacility = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete("http://localhost:8080/facilities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeletionSuccess(); // Callback to parent component to update state
      // onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting facility:", error.message);
      // Optionally handle the error in UI
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this facility?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-l"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDeleteFacility();
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-r"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDeletionSuccess: PropTypes.func.isRequired,
};

const HomePage = () => {
  const [facility, setFacility] = useState(null);
  const getFacility = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:8080/facilities");
      setFacility(response.data);
    } catch (error) {
      console.error(error);
      // setFacility(null);
    }
  };
  useEffect(() => {
    getFacility();
  }, []);

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const handleEditClick = () => {
    setisEditModalOpen(!isEditModalOpen);
  };

  const updateFacilityDetails = (updatedFacility) => {
    setFacility(updatedFacility);
  };

  // const deleteFacility = (updatedFacility) => {
  //   setFacility(updatedFacility);
  // };
  const handleAddClick = () => {
    setisEditModalOpen(true);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center w-1/2 max-w-screen-lg">
        <div className="border p-4 m-4 rounded shadow w-96 relative">
          {" "}
          {/* Labels box */}
          {facility ? (
            <div className="flex flex-col justify-between h-auto">
              <div>
                {isDeleteModalOpen && (
                  <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeletionSuccess={() => setFacility(null)}
                  />
                )}

                <EditModal
                  isOpen={isEditModalOpen}
                  onClose={() => setisEditModalOpen(false)}
                  facility={facility}
                  closeModal={() => setisEditModalOpen(false)}
                  onUpdate={updateFacilityDetails}
                  operationType="update"
                />
              </div>
              <LabelDisplay
                label="Name"
                value={facility.facilityName}
              ></LabelDisplay>
              <LabelDisplay
                label="Type"
                value={facility.facilityType}
              ></LabelDisplay>
              <LabelDisplay
                label="Shifts"
                value={facility.numberShifts}
              ></LabelDisplay>
              <LabelDisplay
                label="Days"
                value={facility.numberDays}
              ></LabelDisplay>
              <LabelDisplay
                label="Operating hours"
                value={
                  facility.operatingHours
                    ? `${facility.operatingHours.start} - ${facility.operatingHours.end}`
                    : "N/A"
                }
              />
              <div className="flex flex-wrap justify-between mt-4 gap-2">
              <Link to="/employees" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full sm:w-auto">
                Employees
              </Link>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full sm:w-auto">
                  Schedules
                </button>
              </div>
              {!isEditModalOpen && (
                <div className="absolute top-3 right-3 flex flex-col items-end">
                  <svg
                    onClick={() => handleEditClick()}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 cursor-pointer hover:fill-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    onClick={handleDeleteClick}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 cursor-pointer hover:fill-red-400 mt-4 mr-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <svg
                onClick={handleAddClick}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 cursor-pointer hover:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {isEditModalOpen && (
                <EditModal
                  isOpen={isEditModalOpen}
                  onClose={() => setisEditModalOpen(false)}
                  facility={facility}
                  closeModal={() => setisEditModalOpen(false)}
                  onUpdate={updateFacilityDetails}
                  operationType="add"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
