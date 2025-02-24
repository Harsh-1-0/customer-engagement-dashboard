import { useState, useEffect } from "react";
import axios from "axios";
import EngagementScoreChart from "./engagementScore";
function EngegementScore() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5500/users/engagement-scores",
          {}
        );
        const formattedData = response.data.map((item) => ({
          email: item.email || "Unknown",
          value: item.engagementScore || 0,
        }));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return (
    <div>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <EngagementScoreChart data={data} />
      )}
    </div>
  );
}

export default EngegementScore;
