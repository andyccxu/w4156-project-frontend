import { useEffect, useState } from "react";
import axios from "axios";
import FacilityForm from "../components/FacilityForm";
import PropTypes from "prop-types";

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

const EditModal = ({ isOpen, onClose, facility, closeModal, onUpdate, operationType }) => {
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
          className="w-7 h-7 absolute top-3 right-3 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <div className="w-full">
          {/* FacilityForm Component */}
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEditClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const updateFacilityDetails = (updatedFacility) => {
    setFacility(updatedFacility);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
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
                <EditModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  facility={facility}
                  closeModal={() => setIsModalOpen(false)}
                  onUpdate={updateFacilityDetails} 
                  operationType={"update"}
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
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full sm:w-auto">
                  Employees
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full sm:w-auto">
                  Schedules
                </button>
              </div>
              {!isModalOpen && (
                <svg
                  onClick={() => handleEditClick()}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-7 h-7 absolute top-3 right-3 cursor-pointer hover:fill-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <svg 
                onClick={handleAddClick}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {isModalOpen && (
              <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                facility={facility}
                closeModal={() => setIsModalOpen(false)}
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
