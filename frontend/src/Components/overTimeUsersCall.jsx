import { useState, useEffect } from "react";
import axios from "axios";
import ActiveUsersChart from "./overTimeActive";
function OverTimeActiveUsers() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/users/active-users-overtime",
          {}
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div>
      {data.length === 0 ? <p>Loading...</p> : <ActiveUsersChart data={data} />}
    </div>
  );
}

export default OverTimeActiveUsers;
