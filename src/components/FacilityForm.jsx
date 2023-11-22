import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const FacilityForm = ({ facility, closeModal, onUpdate, operationType }) => {
  const initializeFormData = () => {
    if (facility) {
      return {
        facilityName: facility.facilityName || "",
        facilityType: facility.facilityType || "",
        operatingHoursStart: facility.operatingHours?.start || "",
        operatingHoursEnd: facility.operatingHours?.end || "",
        numberEmployees: facility.numberEmployees || "",
        numberShifts: facility.numberShifts || "",
        numberDays: facility.numberDays || "",
      };
    } else {
      return {
        facilityName: "",
        facilityType: "",
        operatingHoursStart: "",
        operatingHoursEnd: "",
        numberEmployees: "",
        numberShifts: "",
        numberDays: "",
      };
    }
  };

  const [formData, setFormData] = useState(initializeFormData);

  FacilityForm.propTypes = {
    facility: PropTypes.shape({
      facilityName: PropTypes.string,
      facilityType: PropTypes.string,
      operatingHours: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string,
      }),
      numberEmployees: PropTypes.string,
      numberShifts: PropTypes.string,
      numberDays: PropTypes.string,
    }).isRequired,
    closeModal: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    operationType: PropTypes.string.isRequired,

  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken"); // Replace with your token retrieval logic
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedFormData = {
        ...formData,
        operatingHours: {
          start: formData.operatingHoursStart,
          end: formData.operatingHoursEnd,
        },
      };
      
      let response;
      if (operationType === "update") {
        response = await axios.patch(
          "http://localhost:8080/facilities", // Update the URL as needed
          updatedFormData,
          config
        );
      } else if (operationType === "add") {
        response = await axios.post(
          "http://localhost:8080/facilities", // Update the URL as needed
          updatedFormData,
          config
        );
      }



      console.log(response.data);
      if (onUpdate) {
        onUpdate(response.data);
      }
      if (closeModal) {
        closeModal();
      }
    } catch (error) {
      console.error(
        "Error updating facility:",
        error.response ? error.response.data : error.message
      );
      // Optional: Show error message to the user
    }
  };

  return (
    <div className="w-full max-w-xs">
      <p className="block text-gray-700 text-lg font-bold mb-4">
        Edit Facility
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="facilityName"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="facilityName"
            name="facilityName"
            type="text"
            placeholder={facility ? facility.facilityName : "Facility Name"}
            value={formData.facilityName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="facilityType"
          >
            Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="facilityType"
            name="facilityType"
            type="text"
            placeholder={facility ? facility.facilityType : "Facility Type"}
            value={formData.facilityType}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numberShifts"
          >
            Shifts
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numberShifts"
            name="numberShifts"
            type="number" // Assuming this should be a numeric input
            placeholder={facility ? facility.numberShifts : "Number of Shifts"}
            value={formData.numberShifts}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numberDays"
          >
            Days
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numberDays"
            name="numberDays"
            type="number" // Assuming this should be a numeric input
            placeholder={facility ? facility.numberDays : "Number of Days"}
            value={formData.numberDays}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Operating Hours
          </label>
          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="operatingHoursStart"
                name="operatingHoursStart"
                type="time"
                placeholder="Start Time"
                value={formData.operatingHoursStart}
                onChange={handleChange}
              />
            </div>

            <div className="flex-1 ml-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="operatingHoursEnd"
                name="operatingHoursEnd"
                type="time"
                placeholder="End Time"
                value={formData.operatingHoursEnd}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full w-full sm:w-auto mt-3"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default FacilityForm;
