import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSchedules = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:8080/schedules");
      console.log(response.data);
      setSchedules(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // when our application is first run
    getSchedules();
  }, []);

  return (
    // JSX code rendering the home page
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {loading ? (
          "Loading"
        ) : (
          // empty bracket means to use a Fragment
          <>
            {schedules.length > 0 ? (
              <>
                {/* map/loop through the schedules array */}
                {schedules.map((schedule, index) => {
                  console.log(schedule);
                  return (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-md p-2 mb-4"
                    >
                      <div className="font-bold text-lg mb-2">
                        {schedule._id}
                      </div>
                      <div className="text-sm mb-2">
                        {schedule.dateGenerated}
                      </div>
                      <div className="text-sm mb-2">{schedule.facilityId}</div>
                      {/* create a new div for each shift entry */}
                      <div className="grid grid-cols-2 gap-2">
                        {schedule.shifts.map((shift, index) => {
                          return (
                            <div
                              key={index}
                              className="border-2 border-gray-200 rounded-md p-2 mb-2"
                            >
                              <div className="text-sm">{shift.start}</div>
                              <div className="text-sm">{shift.end}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div>There is no schedule</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
