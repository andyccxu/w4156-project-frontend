import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [facilities, setFacilities] = useState([]);

  const getFacilities = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:8080/facilities");
      setFacilities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // when our application is first run
    getFacilities();
  }, []);

  return (
    // JSX code rendering the home page
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
      <>
        {facilities.length > 0 ? (
          <>
            {/* map/loop through the schedules array */}
            {facilities.map((facility, index) => {
              return (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-md p-2 mb-4"
                >
                  <div className="font-bold text-lg mb-2">{facility._id}</div>
                  <div className="font-bold text-lg mb-2">
                    {facility.facilityType}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>There is no facility.</div>
        )}
      </>
    </div>
  );
};

export default HomePage;
